<script lang="ts" setup>
import { useElementHover } from '@vueuse/core';

const props = defineProps<{
  part: PartToCut;
}>();
const width = useFormattedDistance(() => props.part.size.width);
const length = useFormattedDistance(() => props.part.size.length);
const thickness = useFormattedDistance(() => props.part.size.thickness);
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
