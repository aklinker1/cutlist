import { useQueryClient } from '@tanstack/vue-query';

export default function () {
  const queries = useQueryClient();
  return async () => {
    await queries.refetchQueries({
      queryKey: ['onshape'],
    });
  };
}
