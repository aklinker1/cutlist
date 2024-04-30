import { Distance, toFraction } from '@aklinker1/cutlist';

export default function () {
  const { distanceUnit } = useProjectSettings();

  return (m: number | undefined | null) => {
    if (m == null || toValue(distanceUnit) == null) return;

    const distance = new Distance(m);
    if (toValue(distanceUnit) === 'in') {
      return `${toFraction(distance.in)}"`;
    }
    if (toValue(distanceUnit) === 'mm') {
      return `${distance.mm}mm`;
    }
    return `${distance.m.toFixed(3)}m`;
  };
}
