/**
 * Distinct hue per cut, spread evenly around the wheel so neighbouring cuts
 * (which are often next to each other on the board) are easy to tell apart.
 * Shared by the cut overlay and the cut list so their colors line up.
 */
export function cutColor(order: number, count: number): string {
  return `hsl(${Math.round(((order - 1) * 360) / Math.max(count, 1))}, 75%, 45%)`;
}
