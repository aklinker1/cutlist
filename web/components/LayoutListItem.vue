<script lang="ts" setup>
import { Distance } from '~~/src/units';

const props = defineProps<{
  layout: BoardLayout;
}>();

const widthPx = usePx(() => props.layout.stock.width);
const heightPx = usePx(() => props.layout.stock.height);

const thickness = useFormattedDistance(() => props.layout.stock.data.thickness);
const width = useFormattedDistance(() => props.layout.stock.data.width);
const length = useFormattedDistance(() => props.layout.stock.data.length);
</script>

<template>
  <li class="flex flex-col items-center gap-4">
    <p class="text-center">
      <span class="font-bold text-nowrap">{{
        layout.stock.data.material
      }}</span>
      <br />
      <span class="text-xs text-nowrap"
        >{{ thickness }} &times; {{ width }} &times; {{ length }}</span
      >
    </p>
    <div
      class="bg-gray-800 rounded relative ring-1 ring-gray-600 ring-inset"
      :style="`width:${widthPx};height:${heightPx}`"
    >
      <PartListItem
        v-for="placement of layout.placements"
        :placement="placement"
      />
    </div>
  </li>
</template>
