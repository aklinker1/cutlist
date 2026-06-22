<script lang="ts" setup>
import { generateCuts } from '@aklinker1/cutlist';

const { data, isLoading } = useBoardLayoutsQuery();
const formatDistance = useFormatDistance();
const hoveredCut = useHoveredCut();
const showCuts = useShowCuts();
const bladeWidthM = useBladeWidthM();

// Opening this tab is a clear signal the user wants to see the cuts, so make
// sure the overlay is on (otherwise hovering a row would highlight nothing).
onMounted(() => {
  showCuts.value = true;
});

const boards = computed(() =>
  (data.value?.layouts ?? []).map((layout, layoutIndex) => {
    const rawCuts = generateCuts(layout, { minLeftoverM: bladeWidthM.value });
    const cuts = rawCuts.map((cut) => ({
      order: cut.order,
      color: cutColor(cut.order, rawCuts.length),
      type: cut.orientation === 'rip' ? 'Rip' : 'Crosscut',
      // A rip is positioned from the left edge, a crosscut from the bottom.
      from: cut.orientation === 'rip' ? 'from left' : 'from bottom',
      posLabel: formatDistance(cut.posM),
      lengthLabel: formatDistance(cut.endM - cut.startM),
    }));
    return {
      layoutIndex,
      material: layout.stock.material,
      size: `${formatDistance(layout.stock.widthM)} × ${formatDistance(layout.stock.lengthM)}`,
      cuts,
    };
  }),
);

const isHovered = (layoutIndex: number, order: number) =>
  hoveredCut.value?.layout === layoutIndex && hoveredCut.value?.order === order;
</script>

<template>
  <div class="absolute inset-0 overflow-auto">
    <p v-if="isLoading" class="text-center p-4 opacity-50">Loading…</p>
    <p v-else-if="boards.length === 0" class="text-center p-4 opacity-50">
      No cuts to make.
    </p>

    <div v-for="board of boards" :key="board.layoutIndex">
      <div
        class="sticky top-0 z-10 bg-gray-100 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-800"
      >
        <p class="font-bold text-sm">
          Board {{ board.layoutIndex + 1 }} — {{ board.material }}
        </p>
        <p class="text-xs opacity-60">{{ board.size }}</p>
      </div>

      <ul @mouseleave="hoveredCut = null">
        <li
          v-for="cut of board.cuts"
          :key="cut.order"
          class="flex items-center gap-3 px-4 py-2 cursor-default border-b border-gray-100 dark:border-gray-800/50"
          :class="
            isHovered(board.layoutIndex, cut.order)
              ? 'bg-primary-50 dark:bg-primary-950'
              : undefined
          "
          @mouseenter="
            hoveredCut = { layout: board.layoutIndex, order: cut.order }
          "
        >
          <span
            class="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
            :style="{ backgroundColor: cut.color }"
          >
            {{ cut.order }}
          </span>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium">
              {{ cut.type }}
              <span class="opacity-60">@ {{ cut.posLabel }}</span>
            </p>
            <p class="text-xs opacity-60">{{ cut.from }}</p>
          </div>
          <span class="text-xs opacity-60 shrink-0"
            >{{ cut.lengthLabel }} long</span
          >
        </li>
      </ul>
    </div>
  </div>
</template>
