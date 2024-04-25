export class Point {
  constructor(
    readonly x: number,
    readonly y: number,
  ) {}

  clone(changes?: { x?: number; y?: number }): Point {
    return new Point(changes?.x ?? this.x, changes?.y ?? this.y);
  }

  add(x: number, y: number): Point {
    return this.clone({
      x: this.x + x,
      y: this.y + y,
    });
  }

  sub(x: number, y: number): Point {
    return this.add(-x, -y);
  }
}
