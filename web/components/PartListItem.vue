<script lang="ts" setup>
import { useElementHover } from '@vueuse/core';

const props = defineProps<{
  placement: Rectangle<PartToCut>;
}>();

const container = ref<HTMLDivElement>();
const isHovered = useElementHover(container);

const width = usePx(() => props.placement.width);
const height = usePx(() => props.placement.height);
const left = usePx(() => props.placement.left);
const bottom = usePx(() => props.placement.bottom);
</script>

<template>
  <div
    ref="container"
    class="absolute cursor-pointer"
    :style="`bottom:${bottom};left:${left}`"
  >
    <UPlaceholder
      :color="isHovered ? 'primary' : 'white'"
      :style="`width:${width};height:${height}`"
    />
    <PartDetailsTooltip v-if="isHovered" :part="placement" />
  </div>
</template>
