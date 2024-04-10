import { useQuery } from '@tanstack/vue-query';
import { generateBoardLayouts } from '@aklinker1/cutlist';

export default function () {
  const loader = useOnshapeLoader();
  const url = useAssemblyUrl();
  const config = useCutlistConfig();
  const stock = useStock();

  const partsQuery = useQuery({
    queryKey: ['onshape', 'board-layouts', url],
    queryFn: () => loader.getParts(url.value!),
    enabled: computed(() => url.value != null),
  });

  const layouts = computed(() => {
    const parts = partsQuery.data.value;
    if (parts == null) return undefined;

    return generateBoardLayouts(parts, stock.value, config.value);
  });

  return {
    ...partsQuery,
    data: layouts,
  };
}
