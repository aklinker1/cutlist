import { useQueryClient } from '@tanstack/vue-query';

export default function () {
  const client = useQueryClient();
  const accountId = useAccountServiceId();
  return async () => {
    client.invalidateQueries({
      queryKey: ['projects', accountId.value],
    });
  };
}
