export default createGlobalState(() =>
  useLocalStorage<string[]>('@culist/open-project-ids', []),
);
