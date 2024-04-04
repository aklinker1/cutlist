<script lang="ts" setup>
import type { BoardLayoutLeftover } from '@aklinker1/cutlist';

const props = defineProps<{
  part: BoardLayoutLeftover;
}>();
const width = useFormattedDistance(() => props.part.widthM);
const length = useFormattedDistance(() => props.part.lengthM);
const thickness = useFormattedDistance(() => props.part.thicknessM);
</script>

<template>
  <li>
    <span class="text-primary"
      >{{ part.partNumber }}.{{ part.instanceNumber }} {{ part.name }}</span
    >
    &bull; No suitable board found.

    <br />
    <span class="opacity-50">Material: {{ part.material }}</span>
    <br />
    <span class="opacity-50"
      >Size: {{ thickness }} &times; {{ width }} &times; {{ length }}</span
    >
  </li>
</template>
