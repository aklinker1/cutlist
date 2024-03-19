<script lang="ts" setup>
const { data: doc } = useDocumentQuery();
const { data, isLoading } = useBoardLayoutsQuery();
const distanceUnit = useDistanceUnit();
const formatDistance = useFormatDistance();

const rows = computed(() => {
  if (data.value == null) return [];

  const map = [
    ...data.value?.layouts.flatMap((layout) =>
      layout.placements.map((p) => p.data),
    ),
    ...data.value?.leftovers,
  ].reduce<Map<number, PartToCut[]>>((acc, part) => {
    const items = acc.get(part.partNumber) ?? [];
    items.push(part);
    acc.set(part.partNumber, items);
    return acc;
  }, new Map());

  return [...map.values()].map((instanceList) => {
    const part = instanceList[0];
    return {
      'Part Name': part.name,
      QTY: instanceList.length,
      Material: part.material,
      [`Size (${distanceUnit.value})`]: `${formatDistance(part.size.thickness)} × ${formatDistance(part.size.width)} × ${formatDistance(part.size.length)}`,
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
