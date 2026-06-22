import { useQueryClient } from '@tanstack/vue-query';

export default function () {
  const queries = useQueryClient();
  const url = useAssemblyUrl();
  return async () => {
    if (url.value) {
      await $fetch('/api/parts', {
        query: { url: url.value, refresh: 'true' },
      });
    }
    await queries.refetchQueries({ queryKey: ['onshape'] });
  };
}
