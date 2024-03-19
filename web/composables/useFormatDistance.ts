import { Distance, toFraction } from '~~/src/units';

export default function () {
  const unit = useDistanceUnit();

  return (m: number | undefined | null) => {
    if (m == null) return;

    const distance = new Distance(m);
    if (toValue(unit) === 'in') {
      return `${toFraction(distance.in)}"`;
    }
    if (toValue(unit) === 'mm') {
      return `${distance.mm}mm`;
    }
    return `${distance.m.toFixed(3)}m`;
  };
}
