export default function () {
  const scale = useScale();
  return (value: number) => `${value * 500 * scale.value}px`;
}
