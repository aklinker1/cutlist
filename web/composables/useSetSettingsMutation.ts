import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { AccountSettings } from '~/utils';

export default function () {
  const accountService = useAccountService();
  const client = useQueryClient();

  return useMutation({
    mutationFn({
      projectId,
      changes,
    }: {
      projectId: string | undefined;
      changes: Partial<AccountSettings>;
    }) {
      console.log('SAVING...', { changes });
      return accountService.value.setSettings(projectId, changes);
    },
    onSettled() {
      client.invalidateQueries({
        queryKey: ['settings'],
      });
    },
  });
}
