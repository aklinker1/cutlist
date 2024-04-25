import { useMutation } from '@tanstack/vue-query';
import type { AccountSettings } from '~/utils';

export default function () {
  const accountService = useAccountService();

  return useMutation({
    mutationFn(changes: Partial<AccountSettings>) {
      return accountService.value.setSettings(changes);
    },
  });
}
