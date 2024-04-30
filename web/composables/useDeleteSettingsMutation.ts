import { useMutation, useQueryClient } from '@tanstack/vue-query';

export default function () {
  const accountService = useAccountService();
  const client = useQueryClient();

  return useMutation({
    mutationFn(projectId: string | undefined) {
      return accountService.value.deleteSettings(projectId);
    },
    onSettled() {
      client.invalidateQueries({
        queryKey: ['settings'],
      });
    },
  });
}
