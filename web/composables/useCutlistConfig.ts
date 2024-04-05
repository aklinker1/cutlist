import type { Config } from '@aklinker1/cutlist';

export default createSharedComposable(() => {
  const bladeWidth = useBladeWidth();
  const optimize = useOptimizeFor();
  const extraSpace = useExtraSpace();

  return computed<Config>(() => ({
    bladeWidth: bladeWidth.value,
    optimize: optimize.value,
    extraSpace: extraSpace.value,
  }));
});
