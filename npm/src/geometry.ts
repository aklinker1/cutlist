import type { PartToCut, Stock, Config, BoardLayout } from './types';
import { Distance } from './units';

export class Rectangle<TData> {
  /**
   * In meters
   */
  x: number;
  /**
   * In meters
   */
  y: number;
  /**
   * In meters
   */
  width: number;
  /**
   * In meters
   */
  height: number;

  constructor(
    readonly data: TData = undefined as TData,
    x: number = 0,
    y: number = 0,
    width: number = 0,
    height: number = 0,
  ) {
    // Make sure width and height are positive
    this.x = Math.min(x, x + width);
    this.y = Math.min(y, y + height);
    this.width = Math.abs(width);
    this.height = Math.abs(height);
  }

  get left(): number {
    return this.x;
  }

  get right(): number {
    return this.x + this.width;
  }

  get top(): number {
    return this.y + this.height;
  }

  get bottom(): number {
    return this.y;
  }

  get center(): Point {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    };
  }

  get area(): number {
    return this.width * this.height;
  }

  pad(padding: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  }): Rectangle<TData> {
    // Adjust x, y, width, and height according to padding
    const x = this.x - (padding.left ?? 0);
    const y = this.y - (padding.bottom ?? 0);
    const width = this.width + (padding.left ?? 0) + (padding.right ?? 0);
    const height = this.height + (padding.bottom ?? 0) + (padding.top ?? 0);

    return new Rectangle(this.data, x, y, width, height);
  }

  isInside(other: Rectangle<any>, threshold = 1e-5): boolean {
    return (
      this.left >= other.left - threshold &&
      this.right <= other.right + threshold &&
      this.top <= other.top + threshold &&
      this.bottom >= other.bottom - threshold
    );
  }

  isIntersecting(other: Rectangle<any>, threshold = 1e-5): boolean {
    return !(
      this.right < other.left - threshold ||
      this.left > other.right + threshold ||
      this.top < other.bottom - threshold ||
      this.bottom > other.top + threshold
    );
  }

  growTo(other: Rectangle<any>): Rectangle<undefined> {
    const right = Math.max(this.right, other.right);
    const top = Math.max(this.top, other.top);
    const left = Math.min(this.left, other.left);
    const bottom = Math.min(this.bottom, other.bottom);
    const width = right - left;
    const height = top - bottom;
    return new Rectangle(undefined, left, bottom, width, height);
  }

  translate(x: number, y: number): Rectangle<TData> {
    return new Rectangle(
      this.data,
      this.x + x,
      this.y + y,
      this.width,
      this.height,
    );
  }

  flipYAxis(): Rectangle<TData> {
    return new Rectangle(this.data, this.x, -this.y, this.width, -this.height);
  }

  toString() {
    return JSON.stringify(this);
  }
}

export interface Point {
  /**
   * In meters
   */
  x: number;
  /**
   * In meters
   */
  y: number;
}

export class BoardLayouter {
  readonly placements: Rectangle<PartToCut>[] = [];
  private readonly paddedStock: Rectangle<Stock>;

  constructor(
    readonly stock: Rectangle<Stock>,
    readonly config: Config,
  ) {
    const padding = -new Distance(config.extraSpace).m;
    console.log('PADDING', padding, {
      a: stock,
      b: stock.pad({ right: padding, top: padding }),
    });
    this.paddedStock = stock.pad({ right: padding, top: padding });
  }

  tryAddPart(part: PartToCut): boolean {
    if (part.material !== this.stock.data.material) return false;

    switch (this.config.optimize) {
      case 'space':
        return this.tryAddPartTight(part);
      case 'cuts':
        return this.tryAddPartVertical(part);
      default:
        return false;
    }
  }

  private tryAddPartFn(
    part: PartToCut,
    getPossiblePositions: () => Point[],
  ): boolean {
    const possiblePositions: Point[] =
      this.placements.length === 0
        ? // Always position bottom left when empty
          [{ x: this.paddedStock.x, y: this.paddedStock.y }]
        : // Get possible locations from callback
          getPossiblePositions();

    const placement = possiblePositions
      .map(
        ({ x, y }) =>
          new Rectangle(part, x, y, part.size.width, part.size.length),
      )
      .find(
        (placement) =>
          placement.isInside(this.paddedStock) &&
          this.placements.every((p) => !placement.isIntersecting(p)),
      );

    if (placement) {
      this.placements.push(placement);
      return true;
    } else {
      return false;
    }
  }

  tryAddPartTight(part: PartToCut): boolean {
    return this.tryAddPartFn(part, () =>
      this.placements
        .flatMap((existing) => {
          const bladeWidth = new Distance(this.config.bladeWidth).m;
          return [
            // Left of stock and top of existing
            { x: this.paddedStock.x, y: existing.top + bladeWidth },
            // left of existing, bottom of stock
            { x: existing.right + bladeWidth, y: this.paddedStock.y },

            // Left of existing, top of other existing
            ...this.placements.map((existing2) => ({
              x: existing.right + bladeWidth,
              y: existing2.top + bladeWidth,
            })),
          ];
        })
        // Pack tight to the bottom left (prefer bottom over left)
        .toSorted((a, b) => {
          if (Math.abs(a.y - b.y) > 1e-5) return a.y - b.y;
          if (Math.abs(a.x - b.x) > 1e-5) return a.x - b.x;
          return 0;
        }),
    );
  }

  tryAddPartVertical(part: PartToCut): boolean {
    return this.tryAddPartFn(part, () => {
      // Group items with same X
      const columns = this.placements.reduce<
        Map<number, Rectangle<PartToCut>[]>
      >((acc, placement) => {
        const items = acc.get(placement.x) ?? [];
        items.push(placement);
        acc.set(placement.x, items);
        return acc;
      }, new Map());

      // Remove columns with a different widths
      const sameWidthColumns = [...columns.entries()].filter(
        ([_, items]) => Math.abs(items[0].width - part.size.width) < 1e-5,
      );

      // Add the spot above the last item in each column
      const bladeWidth = new Distance(this.config.bladeWidth).m;
      const possiblePlacements: Rectangle<PartToCut>[] = [
        ...sameWidthColumns.values(),
      ].map(([x, items]) => {
        const last = items.at(-1);
        const y = last == null ? 0 : last.top + bladeWidth;
        return new Rectangle(part, x, y, part.size.width, part.size.length);
      });

      // Create a new column for it to be placed in
      const lastRight = [...columns.values()].reduce(
        (acc, items) => Math.max(acc, items[0].right),
        0,
      );
      const newColumnX = lastRight === 0 ? 0 : lastRight + bladeWidth;
      possiblePlacements.push(
        new Rectangle(part, newColumnX, 0, part.size.width, part.size.length),
      );

      return (
        possiblePlacements
          // Pack tight to the bottom left (prefer left over bottom)
          .toSorted((a, b) => {
            if (Math.abs(a.x - b.x) > 1e-5) return a.x - b.x;
            if (Math.abs(a.y - b.y) > 1e-5) return a.y - b.y;
            return 0;
          })
      );
    });
  }

  reduceStock(allStock: Rectangle<Stock>[]): BoardLayouter {
    const validStock = allStock.filter(
      (stock) => stock.data.material === this.paddedStock.data.material,
    );
    const validLayouts = validStock
      .map((stock) => {
        const layout = new BoardLayouter(stock, this.config);
        this.placements.forEach(({ data: part }) => {
          layout.tryAddPart(part);
        });
        return layout;
      })
      .filter((layout) => layout.placements.length === this.placements.length);
    validLayouts.push(this);
    return validLayouts.toSorted((a, b) => a.stock.area - b.stock.area)[0];
  }

  toBoardLayout(): BoardLayout {
    return {
      stock: {
        material: this.stock.data.material,
        widthM: this.stock.data.width,
        lengthM: this.stock.data.length,
        thicknessM: this.stock.data.thickness,
      },
      placements: this.placements.map((item) => ({
        partNumber: item.data.partNumber,
        instanceNumber: item.data.instanceNumber,
        name: item.data.name,
        material: item.data.material,
        xM: item.x,
        yM: item.y,
        widthM: item.data.size.width,
        lengthM: item.data.size.length,
        thicknessM: item.data.size.thickness,
        bottomM: item.bottom,
        leftM: item.left,
        rightM: item.right,
        topM: item.top,
      })),
    };
  }
}
