import {
  type Config,
  type Project,
  type StockMatrix,
  getCutlist,
} from '~~/src';
import { useAsyncState } from '@vueuse/core';
import consola from 'consola';

export default function (
  _did: MaybeRefOrGetter<string | undefined>,
  _eid: MaybeRefOrGetter<string | undefined>,
  _bladeWidth: MaybeRefOrGetter<number | undefined>,
  _optimize: MaybeRefOrGetter<'cuts' | 'space' | undefined>,
) {
  const onshape = useOnshapeApi();

  const { isLoading, execute, error, state } = useAsyncState(
    async () => {
      const did = toValue(_did);
      const eid = toValue(_eid);
      const bladeWidth = toValue(_bladeWidth);
      const optimize = toValue(_optimize);

      if (did == null) return undefined;
      if (eid == null) return undefined;
      if (bladeWidth == null) return undefined;
      if (optimize == null) return undefined;

      const config: Config = {
        bladeWidth: bladeWidth,
        optimize: optimize,
      };
      const project: Project = {
        source: {
          type: 'onshape',
          id: did,
          assemblyId: eid,
        },
      };

      return await getCutlist(onshape, project, stock, config, consola.debug);
    },
    undefined,
    {
      immediate: process.client,
    },
  );

  watch(
    [
      computed(() => toValue(_did)),
      computed(() => toValue(_eid)),
      computed(() => toValue(_bladeWidth)),
      computed(() => toValue(_optimize)),
    ],
    () => execute(),
  );

  return {
    isLoading,
    parts: state,
    error,
    refetch: execute,
  };
}

const stock: StockMatrix[] = [
  {
    name: 'Red Oak (1x2)',
    material: 'Oak, Red',
    length: ['3ft', '4ft', '6ft', '8ft'],
    thickness: '0.75in',
    width: '1.5in',
  },
  {
    name: 'Red Oak (1x3)',
    material: 'Oak, Red',
    length: ['3ft', '4ft', '6ft', '8ft'],
    thickness: '0.75in',
    width: '2.5in',
  },
  {
    name: 'Red Oak (1x4)',
    material: 'Oak, Red',
    length: ['3ft', '4ft', '6ft', '8ft'],
    thickness: '0.75in',
    width: '3.5in',
  },
  {
    name: 'Red Oak (1x6)',
    material: 'Oak, Red',
    length: ['3ft', '4ft', '6ft', '8ft'],
    thickness: '0.75in',
    width: '5.5in',
  },
  {
    name: 'Red Oak (1x7)',
    material: 'Oak, Red',
    length: ['3ft', '4ft', '6ft', '8ft'],
    thickness: '0.75in',
    width: '7.5in',
  },
];
