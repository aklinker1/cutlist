import { describe, it, expect } from 'bun:test';
import { Rectangle } from '../Rectangle';

const epsilon = 1e-5;

describe('Rectangle', () => {
  describe('constructor', () => {
    it('should support positive sizes', () => {
      const left = 4;
      const bottom = 6;
      const width = 2;
      const height = 3;
      const expected = expect.objectContaining({
        left,
        bottom,
        right: 6,
        top: 9,
        width,
        height,
      });

      const actual = new Rectangle(null, left, bottom, width, height);

      expect(actual).toEqual(expected);
    });

    it('should support negative sizes', () => {
      const left = 4;
      const bottom = 6;
      const width = -2;
      const height = -3;
      const expected = expect.objectContaining({
        left: 2,
        bottom: 3,
        right: 4,
        top: 6,
        width: 2,
        height: 3,
      });

      const actual = new Rectangle(null, left, bottom, width, height);

      expect(actual).toEqual(expected);
    });
  });

  describe('pad', () => {
    const rect = new Rectangle(null, 1, 1, 1, 1);
    const expected = new Rectangle(null, 0, -2, 4, 8);
    const actual = rect.pad({
      left: 1,
      right: 2,
      bottom: 3,
      top: 4,
    });

    expect(actual).toEqual(expected);
  });

  describe('swallow', () => {
    it('should produce the same expanded rectangle regardless of the order', () => {
      const rect1 = new Rectangle(null, 0, 0, 1, 1);
      const rect2 = new Rectangle(null, 4, 4, 1, 1);
      const expected = new Rectangle(null, 0, 0, 5, 5);

      expect(rect1.swallow(rect2)).toEqual(expected);
      expect(rect2.swallow(rect1)).toEqual(expected);
    });
  });

  describe('flipOrientation', () => {
    it('should flip the width and height', () => {
      const rect = new Rectangle(null, 1, 1, 1, 2);
      const expected = new Rectangle(null, 1, 1, 2, 1);

      const actual = rect.flipOrientation();

      expect(actual).toEqual(expected);
    });
  });

  describe('isInside', () => {
    it('should return true when fully inside', () => {
      const rect1 = new Rectangle(null, 1, 1, 2, 2);
      const rect2 = new Rectangle(null, 0, 0, 5, 5);
      expect(rect1.isInside(rect2, epsilon)).toBe(true);
    });

    it('should return true when sides are within a threshold', () => {
      const rect1 = new Rectangle(null, 0, 0, 5, 5);
      const rect2 = new Rectangle(null, -0.1, -0.1, 5.2, 5.2);
      expect(rect1.isInside(rect2, 0.1)).toBe(true);
    });

    it('should return false when partially outside', () => {
      const rect1 = new Rectangle(null, 4, 4, 2, 2);
      const rect2 = new Rectangle(null, 0, 0, 5, 5);
      expect(rect1.isInside(rect2, epsilon)).toBe(false);
    });

    it('should return false when completely outside', () => {
      const rect1 = new Rectangle(null, 6, 6, 2, 2);
      const rect2 = new Rectangle(null, 0, 0, 5, 5);
      expect(rect1.isInside(rect2, epsilon)).toBe(false);
    });
  });

  describe('isIntersecting', () => {
    it('should return false when edges touch', () => {
      const rect1 = new Rectangle(null, 4, 0, 1, 5);
      const rect2 = new Rectangle(null, 0, 0, 5, 5);
      expect(rect1.isIntersecting(rect2, epsilon)).toBe(true);
    });

    it('should return true when partially intersecting', () => {
      const rect1 = new Rectangle(null, 3, 3, 3, 3);
      const rect2 = new Rectangle(null, 0, 0, 5, 5);
      expect(rect1.isIntersecting(rect2, epsilon)).toBe(true);
    });

    it('should return false when sides are within a threshold', () => {
      const rect1 = new Rectangle(null, 5, 5, 1, 1);
      const rect2 = new Rectangle(null, 0, 0, 5, 5);
      expect(rect1.isIntersecting(rect2, 0.1)).toBe(false);
    });

    it('should return false when completely separate', () => {
      const rect1 = new Rectangle(null, 6, 6, 2, 2);
      const rect2 = new Rectangle(null, 0, 0, 5, 5);
      expect(rect1.isIntersecting(rect2, epsilon)).toBe(false);
    });
  });
});
