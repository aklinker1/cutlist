import { isNearlyEqual } from './floating-point-utils';
import type { BoardLayoutStock, PartToCut, Stock } from '../types';

export function isValidStock(
  test: Stock | BoardLayoutStock,
  target: PartToCut | Stock,
  epsilon: number,
) {
  return (
    isNearlyEqual(
      'size' in target ? target.size.thickness : target.thickness,
      'thicknessM' in test ? test.thicknessM : test.thickness,
      epsilon,
    ) && test.material === target.material
  );
}
