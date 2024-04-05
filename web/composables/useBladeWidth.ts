import { Distance } from '@aklinker1/cutlist';

/**
 * Returns the blade width in standard units based off the settings.
 */
export default function () {
  const bladeWidth = useBladeWidthSetting();
  const unit = useDistanceUnit();
  return computed(() => new Distance(bladeWidth.value + unit.value).m);
}
