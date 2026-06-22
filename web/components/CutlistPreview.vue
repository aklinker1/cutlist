<script lang="ts" setup>
const { data, isLoading, error } = useBoardLayoutsQuery();

const container = ref<HTMLDivElement>();
const { scale, resetZoom, zoomIn, zoomOut } = usePanZoom(container);
const showDimensions = useShowDimensions();
const showCuts = useShowCuts();
const printPage = () => window.print();
</script>

<template>
  <div>
    <!-- Cutlist Preview -->
    <div
      class="absolute inset-0 overflow-none border-t-4 border-gray-300 dark:border-gray-800 flex print:static print:overflow-visible print:border-none"
    >
      <p v-if="error" class="m-auto">{{ error }}</p>

      <template v-else-if="data">
        <p
          v-if="data.layouts.length === 0"
          class="m-auto bg-gray-900 shadow-2xl shadow-gray-900 p-4"
        >
          No board layouts found
        </p>
        <div v-else ref="container" class="print-container">
          <LayoutList :layouts="data.layouts" />
        </div>
      </template>

      <div v-else-if="isLoading" class="m-auto flex items-center space-x-4">
        <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
        <div class="space-y-2">
          <USkeleton class="h-4 w-[250px]" />
          <USkeleton class="h-4 w-[200px]" />
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="absolute bottom-4 right-4 flex gap-4 print:hidden z-10">
      <div class="bg-black dark:bg-white rounded shadow-2xl flex">
        <UButton
          title="Toggle dimensions"
          square
          size="lg"
          :color="showDimensions ? 'primary' : 'black'"
          icon="i-heroicons-arrows-right-left"
          @click="showDimensions = !showDimensions"
        />
        <UButton
          title="Toggle cut order"
          square
          size="lg"
          :color="showCuts ? 'primary' : 'black'"
          icon="i-heroicons-scissors"
          @click="showCuts = !showCuts"
        />
        <UButton
          title="Print"
          square
          size="lg"
          color="black"
          icon="i-heroicons-printer"
          @click="printPage"
        />
      </div>
      <ScaleController
        v-if="scale != null"
        class="bg-black dark:bg-white rounded shadow-2xl"
        :scale="scale"
        @reset-zoom="resetZoom"
        @zoom-in="zoomIn"
        @zoom-out="zoomOut"
      />
      <FitController class="bg-black dark:bg-white rounded shadow-2xl" />
    </div>
  </div>
</template>

<style scoped>
@media print {
  .print-container {
    transform: none !important;
  }
}
</style>
