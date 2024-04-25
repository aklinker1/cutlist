export class HashSet<T> {
  private items: Map<T, boolean>;

  constructor(initial?: T[]) {
    this.items = new Map<T, boolean>();
    initial?.forEach((item) => {
      this.add(item);
    });
  }

  add(element: T): void {
    this.items.set(element, true);
  }

  remove(element: T): boolean {
    return this.items.delete(element);
  }

  get size(): number {
    return this.items.size;
  }

  get isEmpty(): boolean {
    return this.size === 0;
  }

  contains(element: T): boolean {
    return this.items.has(element);
  }

  toArray(): T[] {
    return Array.from(this.items.keys());
  }
}
