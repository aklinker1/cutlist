import type { PanZoom, Transform } from 'panzoom';
import panzoom from 'panzoom';

export default function (container: Ref<HTMLElement | undefined>) {
  let instance = ref<PanZoom>();
  const scale = ref<number>();
  let initialTransform: Transform | undefined;

  whenever(
    container,
    (container) => {
      if (instance.value != null) return;
      instance.value = panzoom(container, {
        autocenter: true,
        minZoom: 0.2,
        maxZoom: 10,
      });
      initialTransform = { ...instance.value.getTransform() };
      scale.value = initialTransform.scale;
      instance.value.on('zoom', () => {
        scale.value = instance.value?.getTransform().scale;
      });
    },
    {},
  );
  whenever(
    () => !container.value,
    () => {
      instance.value?.dispose();
    },
  );
  onUnmounted(() => {
    instance.value?.dispose();
  });

  const setZoom = (cb: (scale: number) => number, x?: number, y?: number) => {
    if (instance.value == null) return;
    const current = instance.value.getTransform();
    const currentScale = current.scale;
    const newScale = cb(current.scale);
    instance.value?.smoothZoom(
      x ?? current.x,
      y ?? current.y,
      newScale / currentScale,
    );
  };
  const zoomBy = (increment: number) => setZoom((scale) => scale + increment);

  return {
    scale,
    zoomIn: () => zoomBy(0.1),
    zoomOut: () => zoomBy(-0.1),
    resetZoom: () => {
      if (initialTransform == null) return;

      const { scale, x, y } = initialTransform;
      setZoom(() => scale, x, y);
      setTimeout(() => {
        instance.value?.smoothMoveTo(x, y);
      }, 200);
    },
  };
}
