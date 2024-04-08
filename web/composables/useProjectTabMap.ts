export default createGlobalState(() =>
  useSessionStorage<Record<string, Tab | undefined>>('@cutlist/tab-map', {}),
);

export type Tab = 'bom' | 'stock' | 'settings' | 'warnings';
