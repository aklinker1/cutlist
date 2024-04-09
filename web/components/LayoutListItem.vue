<script lang="ts" setup>
import { type BoardLayout } from '@aklinker1/cutlist';

const props = defineProps<{
  layout: BoardLayout;
}>();

const widthPx = usePx(() => props.layout.stock.widthM);
const heightPx = usePx(() => props.layout.stock.lengthM);

const thickness = useFormattedDistance(() => props.layout.stock.thicknessM);
const width = useFormattedDistance(() => props.layout.stock.widthM);
const length = useFormattedDistance(() => props.layout.stock.lengthM);
</script>

<template>
  <li class="flex flex-col items-center gap-4 shrink-0">
    <p class="text-center">
      <span class="font-bold text-nowrap">{{ layout.stock.material }}</span>
      <br />
      <span class="text-xs text-nowrap"
        >{{ thickness }} &times; {{ width }} &times; {{ length }}</span
      >
    </p>
    <div
      class="bg-gray-200 dark:bg-gray-800 rounded relative ring-1 ring-gray-400 dark:ring-gray-600 print:ring-black ring-inset"
      :style="`width:${widthPx};height:${heightPx}`"
    >
      <PartListItem
        v-for="placement of layout.placements"
        :placement="placement"
      />
    </div>
  </li>
</template>
