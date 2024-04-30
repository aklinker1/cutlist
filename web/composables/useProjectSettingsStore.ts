export default createGlobalState(() =>
  ref<Record<string, Partial<AccountSettings>>>({}),
);
