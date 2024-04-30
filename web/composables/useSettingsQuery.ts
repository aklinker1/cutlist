import { useQuery } from '@tanstack/vue-query';

export default function (projectId: Ref<string | undefined>) {
  const account = useAccountService();
  const accountId = useAccountServiceId();
  return useQuery({
    queryKey: ['settings', accountId, projectId],
    queryFn: () => account.value.getSettings(projectId.value),
  });
}
