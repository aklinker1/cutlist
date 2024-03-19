export default function () {
  const scale = useScale();
  return {
    zoomIn: () => void (scale.value += 0.1),
    zoomOut: () => void (scale.value = Math.max(scale.value - 0.1, 0.1)),
    resetZoom: () => void (scale.value = 1),
  };
}
