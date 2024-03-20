export default function (value: MaybeRefOrGetter<number>): ComputedRef<string> {
  const getPx = useGetPx();
  return computed(() => getPx(toValue(value)));
}
