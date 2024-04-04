import { useQuery } from '@tanstack/vue-query';
import { useOnshapeUrl } from './useOnshapeUrl';

export default function () {
  const onshape = useOnshapeLoader();

  const url = useAssemblyUrl();
  const onshapeUrl = useOnshapeUrl(url);

  return useQuery({
    queryKey: ['onshape', 'document', computed(() => toValue(url))],
    queryFn: async () => {
      if (onshapeUrl.value == null) return undefined;
      return await onshape.getDocument(onshapeUrl.value.did);
    },
  });
}
