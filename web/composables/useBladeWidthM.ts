import { Distance } from '@aklinker1/cutlist';

/**
 * The project's blade kerf in meters — the same value used to pack the boards.
 * Falls back to 1/8" if settings haven't loaded yet.
 */
export default function () {
  const { bladeWidth, distanceUnit } = useProjectSettings();
  return computed(() => {
    if (bladeWidth.value == null || distanceUnit.value == null) return 0.003175;
    return new Distance(bladeWidth.value + distanceUnit.value).m;
  });
}
