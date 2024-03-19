/**
 * Returns the parsed optimize config based on the raw settings.
 */
export default function () {
  const optimize = useOptimizeForSetting();
  return computed(() => (optimize.value === 'Cuts' ? 'cuts' : 'space'));
}
