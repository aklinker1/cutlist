export default createGlobalState(() =>
  useSessionStorage('@cutlist/is-expanded', false),
);
