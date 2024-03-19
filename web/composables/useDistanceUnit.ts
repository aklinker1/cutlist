export default createGlobalState(() =>
  useLocalStorage<'in' | 'm' | 'mm'>('@cutlist/distance-unit', 'in'),
);
