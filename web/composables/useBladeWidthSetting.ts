/**
 * Stores the preference from the settings page directly. Unless you're on the
 * settings page, you should probably use `useBladeWidth` instead for the
 * standardized value.
 */
export default createGlobalState(() =>
  useLocalStorage('@cutlist/blade-width', '0.125'),
);
