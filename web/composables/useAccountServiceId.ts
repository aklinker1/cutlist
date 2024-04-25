export default function () {
  const account = useAccountService();
  return computed(() => account.value.id);
}
