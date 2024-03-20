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

const getPx = useGetPx();
const fontSize = usePx(() =>
  Math.min(
    props.placement.width / 2,
    0.0254, // 1 in to m
  ),
);
</script>

<template>
  <div
    ref="container"
    class="absolute cursor-pointer group"
    :style="`bottom:${bottom};left:${left}`"
  >
    <UPlaceholder
      class="overflow-hidden"
      :color="isHovered ? 'primary' : 'white'"
      :style="`width:${width};height:${height}`"
    >
      <p
        class="w-full text-clip text-gray-400 group-hover:text-primary text-right p-px"
        :style="`font-size:${fontSize};line-height:${fontSize}`"
      >
        {{ placement.data.partNumber }}
      </p>
    </UPlaceholder>
    <PartDetailsTooltip v-if="isHovered" :part="placement" />
  </div>
</template>
