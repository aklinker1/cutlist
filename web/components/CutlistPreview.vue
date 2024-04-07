<script lang="ts" setup>
const { data, isLoading, error } = useBoardLayoutsQuery();

const container = ref<HTMLDivElement>();
const { scale, resetZoom, zoomIn, zoomOut } = usePanZoom(container);
</script>

<template>
  <div>
    <!-- Cutlist Preview -->
    <div class="absolute inset-0 overflow-none">
      <p v-if="error" class="m-auto">{{ error }}</p>

      <template v-else-if="data">
        <p
          v-if="data.layouts.length === 0"
          class="m-auto bg-gray-900 shadow-2xl shadow-gray-900 p-4"
        >
          No board layouts found
        </p>
        <div v-else ref="container">
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
