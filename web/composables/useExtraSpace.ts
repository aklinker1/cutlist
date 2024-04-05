import { Distance } from '@aklinker1/cutlist';

/**
 * Returns the extra space in standard units based off the settings.
 */
export default function () {
  const extraSpace = useExtraSpaceSetting();
  const unit = useDistanceUnit();
  return computed(() => new Distance(extraSpace.value + unit.value).m);
}
