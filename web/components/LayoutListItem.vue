<script lang="ts" setup>
import { type BoardLayout } from '@aklinker1/cutlist';

const props = defineProps<{
  layout: BoardLayout;
  index: number;
}>();

const widthPx = usePx(() => props.layout.stock.widthM);
const heightPx = usePx(() => props.layout.stock.lengthM);

const thickness = useFormattedDistance(() => props.layout.stock.thicknessM);
const width = useFormattedDistance(() => props.layout.stock.widthM);
const length = useFormattedDistance(() => props.layout.stock.lengthM);

const showDimensions = useShowDimensions();
const showCuts = useShowCuts();

// Printable page box (Letter/A4 safe, with 0.4in @page margins). Kept a touch
// under the real printable area so the browser never "shrink-to-fit"s the page.
const PRINT_PAGE_W = 7.3 * 96;
const PRINT_PAGE_H = 9.6 * 96;

// Scale the whole board (plus its labels/dimensions) down so it fills a single
// printed page as much as its aspect ratio allows. Never upscale.
const printScale = computed(() => {
  const boardWpx = props.layout.stock.widthM * 500;
  const boardHpx = props.layout.stock.lengthM * 500;
  // Extra room for the material label above, dimension column on the left, and
  // width dimension below.
  const contentWpx = boardWpx + 24;
  const contentHpx = boardHpx + 56;
  return Math.min(PRINT_PAGE_W / contentWpx, PRINT_PAGE_H / contentHpx, 1);
});
</script>

<template>
  <li
    class="layout-item flex flex-col items-center gap-4 shrink-0"
    :style="{ '--print-scale': printScale }"
  >
    <div class="layout-scale flex flex-col items-center gap-4">
      <p class="text-center">
        <span class="font-bold text-nowrap">{{ layout.stock.material }}</span>
        <br />
        <span class="text-xs text-nowrap"
          >{{ thickness }} &times; {{ width }} &times; {{ length }}</span
        >
      </p>
      <div class="flex items-start gap-1">
        <!-- Length dimension on left -->
        <div
          v-if="showDimensions"
          class="self-stretch flex items-center justify-center w-6"
        >
          <span
            class="text-xs text-gray-500 dark:text-gray-400 print:text-black whitespace-nowrap"
            style="writing-mode: vertical-rl; transform: rotate(180deg)"
            >{{ length }}</span
          >
        </div>
        <div class="flex flex-col items-center gap-1">
          <!-- Board -->
          <div
            class="bg-gray-200 dark:bg-gray-800 rounded relative ring-1 ring-gray-400 dark:ring-gray-600 print:ring-black ring-inset"
            :style="`width:${widthPx};height:${heightPx}`"
          >
            <PartListItem
              v-for="placement of layout.placements"
              :placement="placement"
            />
            <CutLinesOverlay
              v-if="showCuts"
              :layout="layout"
              :layout-index="index"
            />
          </div>
          <!-- Width dimension below -->
          <div
            v-if="showDimensions"
            class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 print:text-black"
            :style="`width:${widthPx}`"
          >
            <div class="flex-1 border-t border-current"></div>
            <span class="whitespace-nowrap">{{ width }}</span>
            <div class="flex-1 border-t border-current"></div>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<style scoped>
@media print {
  .layout-item {
    width: 7.3in;
    height: 9.7in;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
    margin: 0 !important;
    break-after: page;
    page-break-after: always;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .layout-item:last-child {
    break-after: auto;
    page-break-after: auto;
  }
  .layout-scale {
    transform: scale(var(--print-scale));
    transform-origin: top center;
  }
}
</style>
