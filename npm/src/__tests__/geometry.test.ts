import { describe, it, expect } from 'bun:test';
import { Rectangle } from '../geometry';

describe('Geometry Utils', () => {
  describe('Rectangle', () => {
    describe('isInside', () => {
      it('should return true when fully inside', () => {
        const rect1 = new Rectangle(null, 1, 1, 2, 2);
        const rect2 = new Rectangle(null, 0, 0, 5, 5);
        expect(rect1.isInside(rect2)).toBe(true);
      });

      it('should return true when sides are withing a threshold', () => {
        const rect1 = new Rectangle(null, 0, 0, 5, 5);
        const rect2 = new Rectangle(null, -0.1, -0.1, 5.2, 5.2);
        expect(rect1.isInside(rect2, 0.1)).toBe(true);
      });

      it('should return false when partially outside', () => {
        const rect1 = new Rectangle(null, 4, 4, 2, 2);
        const rect2 = new Rectangle(null, 0, 0, 5, 5);
        expect(rect1.isInside(rect2)).toBe(false);
      });

      it('should return false when completely outside', () => {
        const rect1 = new Rectangle(null, 6, 6, 2, 2);
        const rect2 = new Rectangle(null, 0, 0, 5, 5);
        expect(rect1.isInside(rect2)).toBe(false);
      });
    });

    describe('isIntersecting', () => {
      it('should return true when edges touch', () => {
        const rect1 = new Rectangle(null, 4, 0, 1, 5);
        const rect2 = new Rectangle(null, 0, 0, 5, 5);
        expect(rect1.isIntersecting(rect2)).toBe(true);
      });

      it('should return true when partially intersecting', () => {
        const rect1 = new Rectangle(null, 3, 3, 3, 3);
        const rect2 = new Rectangle(null, 0, 0, 5, 5);
        expect(rect1.isIntersecting(rect2)).toBe(true);
      });

      it('should return true when sides are withing a threshold', () => {
        const rect1 = new Rectangle(null, 5, 5, 1, 1);
        const rect2 = new Rectangle(null, 0, 0, 5, 5);
        expect(rect1.isIntersecting(rect2, 0.1)).toBe(true);
      });

      it('should return false when completely separate', () => {
        const rect1 = new Rectangle(null, 6, 6, 2, 2);
        const rect2 = new Rectangle(null, 0, 0, 5, 5);
        expect(rect1.isIntersecting(rect2)).toBe(false);
      });
    });
  });
});
