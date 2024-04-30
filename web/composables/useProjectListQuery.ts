import { useQuery } from '@tanstack/vue-query';

export default function () {
  const account = useAccountService();
  const accountId = useAccountServiceId();
  return useQuery({
    queryKey: ['projects', accountId],
    queryFn: () => account.value.listProjects(),
    initialData: [],
    refetchOnMount: true,
  });
}
