const firebase = createFirebaseAccountService();
const local = createLocalAccountService();

export function useAccountService() {
  const user = useCurrentUser();

  return computed(() => {
    if (user.value == null) return local;
    return firebase;
  });
}
