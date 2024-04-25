import { describe, it, expect } from 'bun:test';
import { toFraction } from '../units';

describe('Unit Utils', () => {
  describe('toFraction', () => {
    it.each([
      [1 / 2, '1/2'],
      [2, '2'],
      [3 + 1 / 8, '3 1/8'],
      [4 + 7 / 32, '4 7/32'],
      [7.33333, '7.33333'],
    ])('%d -> %s', (input, expected) => {
      expect(toFraction(input)).toBe(expected);
    });
  });
});
