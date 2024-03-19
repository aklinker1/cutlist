import { Distance, toFraction } from '~~/src/units';

export default function (meters: MaybeRefOrGetter<number | undefined | null>) {
  const unit = 'in' as 'in' | 'mm' | 'm';

  return computed(() => {
    const m = toValue(meters);
    if (m == null) return;

    const distance = new Distance(m);
    if (toValue(unit) === 'in') {
      return `${toFraction(distance.in)}"`;
    }
    if (toValue(unit) === 'mm') {
      return `${distance.mm}mm`;
    }
    return `${distance.m.toFixed(3)}m`;
  });
}
