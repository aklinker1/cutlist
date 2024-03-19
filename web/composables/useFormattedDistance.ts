export default function (meters: MaybeRefOrGetter<number | undefined | null>) {
  const formatDistance = useFormatDistance();
  return computed(() => formatDistance(toValue(meters)));
}
