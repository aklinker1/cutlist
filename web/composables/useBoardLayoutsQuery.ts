import { useQuery } from '@tanstack/vue-query';
import { useOnshapeUrl } from './useOnshapeUrl';
import { type Project, getBoardLayouts, type Config } from '@aklinker1/cutlist';

export default function () {
  const onshape = useOnshapeApi();
  const url = useAssemblyUrl();
  const onshapeUrl = useOnshapeUrl(url);
  const bladeWidth = useBladeWidth();
  const optimize = useOptimizeFor();
  const stock = useStock();

  return useQuery({
    queryKey: ['board-layouts', url, bladeWidth, optimize, stock],
    queryFn: async () => {
      if (onshapeUrl.value == null) return undefined;

      const project: Project = {
        source: {
          type: 'onshape',
          id: onshapeUrl.value.did,
          assemblyId: onshapeUrl.value.eid,
        },
      };
      const config: Config = {
        bladeWidth: bladeWidth.value,
        optimize: optimize.value,
      };
      return await getBoardLayouts(onshape, project, stock.value, config);
    },
    staleTime: 5 * 60e3, // 5 minutes, will refrech latest document
  });
}
