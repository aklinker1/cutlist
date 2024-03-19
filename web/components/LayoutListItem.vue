<script lang="ts" setup>
import { Distance } from '~~/src/units';

const props = defineProps<{
  layout: BoardLayout;
}>();

const width = usePx(() => props.layout.stock.width);
const height = usePx(() => props.layout.stock.height);
const length = useFormattedDistance(() => props.layout.stock.height);
</script>

<template>
  <li class="flex flex-col items-center gap-4">
    <p class="text-center">{{ layout.stock.data.name }} x {{ length }}</p>
    <div
      class="bg-gray-800 rounded relative ring-1 ring-gray-600 ring-inset"
      :style="`width:${width};height:${height}`"
    >
      <PartListItem
        v-for="placement of layout.placements"
        :placement="placement"
      />
    </div>
  </li>
</template>
