export default function (value: MaybeRefOrGetter<number>): ComputedRef<string> {
  const scale = useScale();
  return computed(() => `${toValue(value) * 500 * scale.value}px`);
}
