<script lang="ts" setup>
import type { BoardLayoutPlacement } from '@aklinker1/cutlist';
import { useElementHover } from '@vueuse/core';

const props = defineProps<{
  placement: BoardLayoutPlacement;
}>();

const container = ref<HTMLDivElement>();
const isLocallyHovered = useElementHover(container);
const hoveredPartNumber = useHoveredPart();

const isHighlighted = computed(
  () =>
    isLocallyHovered.value ||
    hoveredPartNumber.value === props.placement.partNumber,
);

watch(isLocallyHovered, (hovered) => {
  if (hovered) hoveredPartNumber.value = props.placement.partNumber;
  else if (hoveredPartNumber.value === props.placement.partNumber)
    hoveredPartNumber.value = null;
});

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

const { showPartNumbers, showPartNames } = useProjectSettings();
const showDimensions = useShowDimensions();

const partWidth = useFormattedDistance(() => props.placement.widthM);
const partLength = useFormattedDistance(() => props.placement.lengthM);

// The centered label can show the part name and/or its dimensions. Dimensions
// are kept to a single line ("W × L") so the whole block is one tidy rectangle
// of text that can be rotated as a unit.
const labelLines = computed(() => {
  const lines: string[] = [];
  if (showPartNames.value && props.placement.name)
    lines.push(props.placement.name);
  if (showDimensions.value && partWidth.value && partLength.value)
    lines.push(`${partWidth.value} × ${partLength.value}`);
  return lines;
});

// Fit the label inside the part: pick the font size and orientation (upright or
// rotated 90°) that lets the text be as large as possible, growing to fill
// whatever room the part has. Tall, narrow parts usually fit a bigger font when
// the text runs along their length.
const GLYPH_RATIO = 0.6; // average glyph width / height
const LINE_HEIGHT = 1.1; // matches the rendered line-height, plus a hair of slack

const label = computed(() => {
  const lines = labelLines.value;
  if (lines.length === 0) return null;

  const chars = Math.max(...lines.map((l) => l.length), 1);
  const n = lines.length;
  const { widthM: w, lengthM: l } = props.placement;

  // Largest font that fits, for each orientation.
  const upright = Math.min(w / (chars * GLYPH_RATIO), l / (n * LINE_HEIGHT));
  const rotated = Math.min(l / (chars * GLYPH_RATIO), w / (n * LINE_HEIGHT));

  const isRotated = rotated > upright;
  // 0.92 keeps a little breathing room from the edges.
  const fontM = Math.max(upright, rotated) * 0.92;
  return { lines, isRotated, fontM };
});

const labelFontSize = usePx(() => label.value?.fontM ?? 0);
</script>

<template>
  <div
    ref="container"
    class="absolute cursor-pointer group"
    :style="`bottom:${bottom};left:${left}`"
  >
    <UPlaceholder
      class="overflow-hidden"
      :color="isHighlighted ? 'primary' : 'white'"
      :style="`width:${width};height:${height}`"
    >
      <p
        v-if="showPartNumbers"
        class="relative z-10 w-full text-clip text-gray-500 dark:text-gray-400 print:text-black group-hover:text-primary text-right p-px"
        :class="{ 'text-primary': isHighlighted }"
        :style="`font-size:${fontSize};line-height:${fontSize}`"
      >
        {{ placement.partNumber }}
      </p>
      <div
        v-if="label"
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div
          class="text-center text-gray-600 dark:text-gray-300 print:text-black leading-tight"
          :class="{ '-rotate-90': label.isRotated }"
          :style="`font-size:${labelFontSize};line-height:${labelFontSize}`"
        >
          <div
            v-for="(line, i) in label.lines"
            :key="i"
            class="whitespace-nowrap"
          >
            {{ line }}
          </div>
        </div>
      </div>
    </UPlaceholder>
    <Teleport to="body">
      <PartDetailsTooltip
        v-if="isLocallyHovered"
        :part="placement"
        class="pointer-events-none"
      />
    </Teleport>
  </div>
</template>
