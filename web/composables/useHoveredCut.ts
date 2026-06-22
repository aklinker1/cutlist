/**
 * Identifies a single cut across all board layouts: which layout (by index in
 * the layouts list) and its 1-based order within that layout.
 */
export interface HoveredCut {
  layout: number;
  order: number;
}

export default createSharedComposable(() => ref<HoveredCut | null>(null));
