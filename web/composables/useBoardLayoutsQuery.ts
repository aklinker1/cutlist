import { useQuery } from '@tanstack/vue-query';
import {
  Distance,
  generateBoardLayouts,
  type Config,
} from '@aklinker1/cutlist';

export default function () {
  const loader = useOnshapeLoader();
  const url = useAssemblyUrl();
  const { bladeWidth, optimize, extraSpace, distanceUnit, stock } =
    useProjectSettings();
  const parseStock = useParseStock();

  const partsQuery = useQuery({
    queryKey: ['onshape', 'board-layouts', url],
    queryFn: () => loader.getParts(url.value!),
    enabled: computed(() => url.value != null),
  });

  const layouts = computed(() => {
    const parts = partsQuery.data.value;
    if (
      parts == null ||
      bladeWidth.value == null ||
      extraSpace.value == null ||
      optimize.value == null ||
      distanceUnit.value == null ||
      stock.value == null
    )
      return;

    const config: Config = {
      bladeWidth: new Distance(bladeWidth.value + distanceUnit.value).m,
      extraSpace: new Distance(extraSpace.value + distanceUnit.value).m,
      optimize: optimize.value === 'Cuts' ? 'cuts' : 'space',
      precision: 1e-5,
    };
    return generateBoardLayouts(toRaw(parts), parseStock(stock.value), config);
  });

  return {
    ...partsQuery,
    data: layouts,
  };
}
