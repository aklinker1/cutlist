import { useQuery } from '@tanstack/vue-query';
import useOnshapeUrl from './useOnshapeUrl';

export default function (url: MaybeRefOrGetter<string | undefined>) {
  const onshape = useOnshapeLoader();
  const onshapeUrl = useOnshapeUrl(() => toValue(url) ?? '');

  return useQuery({
    queryKey: ['onshape', 'document', computed(() => toValue(url))],
    queryFn: async () => {
      if (onshapeUrl.value == null)
        throw Error('Invalid onshape assembly URL: ' + toValue(url));
      return await onshape.getDocument(onshapeUrl.value.did);
    },
  });
}
