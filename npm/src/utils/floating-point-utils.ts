/**
 * Copied from <https://floating-point-gui.de/errors/comparison/>
 */
export function isNearlyEqual(a: number, b: number, epsilon: number): boolean {
  if (a === b) return true;

  const absA = Math.abs(a);
  const absB = Math.abs(b);
  const diff = Math.abs(a - b);

  if (a === 0 || b === 0 || absA + absB < Number.MIN_VALUE) {
    return diff < epsilon * Number.MIN_VALUE;
  } else {
    // In JavaScript, Number.MAX_VALUE is used as it represents the maximum
    // representable positive number, similar to Float.MAX_VALUE in Java for floating-point literals
    return diff / Math.min(absA + absB, Number.MAX_VALUE) < epsilon;
  }
}

export function isNearlyGreaterThan(
  a: number,
  b: number,
  epsilon: number,
): boolean {
  return a + epsilon > b;
}

export function isNearlyLessThan(
  a: number,
  b: number,
  epsilon: number,
): boolean {
  return a - epsilon < b;
}

export function isNearlyGreaterThanOrEqual(
  a: number,
  b: number,
  epsilon: number,
): boolean {
  return isNearlyEqual(a, b, epsilon) || isNearlyGreaterThan(a, b, epsilon);
}

export function isNearlyLessThanOrEqual(
  a: number,
  b: number,
  epsilon: number,
): boolean {
  return isNearlyEqual(a, b, epsilon) || isNearlyLessThan(a, b, epsilon);
}
