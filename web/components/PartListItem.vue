<script lang="ts" setup>
import type { BoardLayoutPlacement } from '@aklinker1/cutlist';
import { useElementHover } from '@vueuse/core';

const props = defineProps<{
  placement: BoardLayoutPlacement;
}>();

const container = ref<HTMLDivElement>();
const isHovered = useElementHover(container);

const width = usePx(() => props.placement.widthM);
const height = usePx(() => props.placement.lengthM);
const left = usePx(() => props.placement.leftM);
const bottom = usePx(() => props.placement.bottomM);

const fontSize = usePx(() =>
  Math.min(
    props.placement.widthM / 2,
    0.0254, // 1 in to m
  ),
);

const showPartNumbers = useShowPartNumbers();
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
        v-if="showPartNumbers"
        class="w-full text-clip text-gray-400 group-hover:text-primary text-right p-px"
        :style="`font-size:${fontSize};line-height:${fontSize}`"
      >
        {{ placement.partNumber }}
      </p>
    </UPlaceholder>
    <Teleport to="body">
      <PartDetailsTooltip
        v-if="isHovered"
        :part="placement"
        class="pointer-events-none"
      />
    </Teleport>
  </div>
</template>
