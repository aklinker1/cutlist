/**
 * Stores the preference from the settings page directly. Unless you're on the
 * settings page, you should probably use `useOptimze` instead for the
 * standardized value.
 */
export default createGlobalState(() =>
  useLocalStorage('@cutlist/optimize', 'Cuts'),
);
