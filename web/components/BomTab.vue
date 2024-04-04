<script lang="ts" setup>
import type { BoardLayoutLeftover } from '@aklinker1/cutlist';

const { data: doc } = useDocumentQuery();
const { data, isLoading } = useBoardLayoutsQuery();
const distanceUnit = useDistanceUnit();
const formatDistance = useFormatDistance();

const rows = computed(() => {
  if (data.value == null) return [];

  const map = [
    ...data.value?.layouts.flatMap((layout) => layout.placements),
    ...data.value?.leftovers,
  ].reduce<Map<number, BoardLayoutLeftover[]>>((acc, part) => {
    const items = acc.get(part.partNumber) ?? [];
    items.push(part);
    acc.set(part.partNumber, items);
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
        [`Size (${distanceUnit.value})`]: `${formatDistance(part.thicknessM)} × ${formatDistance(part.widthM)} × ${formatDistance(part.lengthM)}`,
      };
    });
});
</script>

<template>
  <div class="absolute inset-0">
    <p v-if="doc == null" class="text-center p-4 opacity-50">
      Enter an assembly URL to get started...
    </p>
    <UTable v-else :rows="rows" :loading="isLoading" />
  </div>
</template>
