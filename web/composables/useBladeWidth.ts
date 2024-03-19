import { Distance } from '~~/src/units';

/**
 * Returns the blade width in standard units based off the settings.
 */
export default function () {
  const bladeWidth = useBladeWidthSetting();
  return computed(() => new Distance(bladeWidth.value + 'in').m);
}
