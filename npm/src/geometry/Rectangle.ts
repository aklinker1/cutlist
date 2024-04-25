import { Point } from './Point';
import {
  isNearlyLessThan,
  isNearlyGreaterThan,
  isNearlyLessThanOrEqual,
  isNearlyGreaterThanOrEqual,
} from '../utils/floating-point-utils';

/**
 * Rectangle with a coordinate system based in the normal cartesion coordinate
 * system, where (0, 0) is in the bottom left.
 */
export class Rectangle<T> {
  readonly left: number;
  readonly bottom: number;
  readonly width: number;
  readonly height: number;

  constructor(
    readonly data: T,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    this.left = Math.min(x + width, x);
    this.bottom = Math.min(y + height, y);
    this.width = Math.abs(width);
    this.height = Math.abs(height);
  }

  toString() {
    return JSON.stringify(this);
  }

  get right(): number {
    return this.left + this.width;
  }

  get top(): number {
    return this.bottom + this.height;
  }

  get center(): Point {
    return new Point(this.left + this.width / 2, this.bottom + this.height / 2);
  }

  get bottomLeft(): Point {
    return new Point(this.left, this.bottom);
  }

  get topLeft(): Point {
    return new Point(this.left, this.top);
  }

  get bottomRight(): Point {
    return new Point(this.right, this.bottom);
  }

  get topRight(): Point {
    return new Point(this.right, this.top);
  }

  clone(changes?: {
    left?: number;
    bottom?: number;
    width?: number;
    height?: number;
  }): Rectangle<T> {
    return new Rectangle(
      this.data,
      changes?.left ?? this.left,
      changes?.bottom ?? this.bottom,
      changes?.width ?? this.width,
      changes?.height ?? this.height,
    );
  }

  moveTo(point: Point): Rectangle<T> {
    return this.clone({
      left: point.x,
      bottom: point.y,
    });
  }

  /**
   * Return an expanded rectangle. Use negative numbers to shrink the rectangle.
   */
  pad(p: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  }): Rectangle<T> {
    return this.clone({
      left: this.left - (p.left ?? 0),
      bottom: this.bottom - (p.bottom ?? 0),
      width: this.width + (p.left ?? 0) + (p.right ?? 0),
      height: this.height + (p.bottom ?? 0) + (p.top ?? 0),
    });
  }

  /**
   * Move the rectangle over by the desired X/Y amounts.
   */
  translate(x: number, y: number): Rectangle<T> {
    return this.clone({
      left: this.left + x,
      bottom: this.bottom + y,
    });
  }

  /**
   * Expand this rectangle to contain another.
   */
  swallow(other: Rectangle<unknown>): Rectangle<T> {
    const left = Math.min(this.left, other.left);
    const bottom = Math.min(this.bottom, other.bottom);
    const right = Math.max(this.right, other.right);
    const top = Math.max(this.top, other.top);
    return this.clone({
      left,
      bottom,
      width: right - left,
      height: top - bottom,
    });
  }

  /**
   * Flip the width and height, keeping it in the same left/bottom.
   */
  flipOrientation(): Rectangle<T> {
    return this.clone({
      width: this.height,
      height: this.width,
    });
  }

  /**
   * Returns true if the other rectangle is inside or the edges are coincident.
   */
  isInside(other: Rectangle<any>, epsilon: number): boolean {
    return (
      isNearlyGreaterThanOrEqual(this.left, other.left, epsilon) &&
      isNearlyLessThanOrEqual(this.right, other.right, epsilon) &&
      isNearlyLessThanOrEqual(this.top, other.top, epsilon) &&
      isNearlyGreaterThanOrEqual(this.bottom, other.bottom, epsilon)
    );
  }

  /**
   * Returns true when the other rectangle is inside this one. Returns false if
   * they're simply touching.
   */
  isIntersecting(other: Rectangle<any>, epsilon: number): boolean {
    return !(
      isNearlyLessThanOrEqual(this.right, other.left, epsilon) ||
      isNearlyGreaterThanOrEqual(this.left, other.right, epsilon) ||
      isNearlyLessThanOrEqual(this.top, other.bottom, epsilon) ||
      isNearlyGreaterThanOrEqual(this.bottom, other.top, epsilon)
    );
  }
}
