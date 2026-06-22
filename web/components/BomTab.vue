<script lang="ts" setup>
import type { BoardLayoutLeftover } from '@aklinker1/cutlist';

const url = useAssemblyUrl();
const { data: doc } = useDocumentQuery(url);
const { data, isLoading } = useBoardLayoutsQuery();
const { distanceUnit } = useProjectSettings();
const formatDistance = useFormatDistance();
const hoveredPartNumber = useHoveredPart();

const rows = computed(() => {
  if (data.value == null) return [];

  const partKey = (part: BoardLayoutLeftover) => {
    const [w, l] = [part.widthM, part.lengthM].sort((a, b) => a - b);
    return `${part.name}|${part.material}|${part.thicknessM}|${w}|${l}`;
  };

  const map = [
    ...data.value?.layouts.flatMap((layout) => layout.placements),
    ...data.value?.leftovers,
  ].reduce<Map<string, BoardLayoutLeftover[]>>((acc, part) => {
    const key = partKey(part);
    const items = acc.get(key) ?? [];
    items.push(part);
    acc.set(key, items);
    return acc;
  }, new Map());

  return [...map.values()]
    .toSorted((a, b) => a[0].partNumber - b[0].partNumber)
    .map((instanceList) => {
      const part = instanceList[0];
      return {
        '#': part.partNumber,
        'Part Name': part.name,
        QTY: instanceList.length,
        Material: part.material,
        [`Size (${distanceUnit.value})`]: `${formatDistance(part.thicknessM)} × ${formatDistance(Math.min(part.widthM, part.lengthM))} × ${formatDistance(Math.max(part.widthM, part.lengthM))}`,
        class:
          hoveredPartNumber.value === part.partNumber
            ? 'bg-primary-50 dark:bg-primary-950'
            : undefined,
      };
    });
});

const onMouseMove = (e: MouseEvent) => {
  const tr = (e.target as Element).closest('tr');
  if (!tr) return;
  const tbody = tr.closest('tbody');
  if (!tbody) return;
  const index = Array.from(tbody.children).indexOf(tr as HTMLTableRowElement);
  if (index >= 0 && index < rows.value.length) {
    hoveredPartNumber.value = rows.value[index]['#'];
  }
};

const onMouseLeave = () => {
  hoveredPartNumber.value = null;
};
</script>

<template>
  <div
    class="absolute inset-0 print:relative"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <p v-if="doc == null" class="text-center p-4 opacity-50">
      Enter an assembly URL to get started...
    </p>
    <UTable v-else :rows="rows" :loading="isLoading" />
  </div>
</template>
