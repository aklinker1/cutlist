import type { BoardLayoutStock, PartToCut, Stock } from '../types';

export function isValidStock(
  test: Stock | BoardLayoutStock,
  target: PartToCut | Stock,
  epsilon: number,
) {
  const testThickness = 'thicknessM' in test ? test.thicknessM : test.thickness;
  const targetThickness =
    'size' in target ? target.size.thickness : target.thickness;
  const testMaterial = test.material.trim().toLowerCase();
  const targetMaterial = target.material.trim().toLowerCase();

  return (
    Math.abs(testThickness - targetThickness) < epsilon &&
    testMaterial === targetMaterial
  );
}
