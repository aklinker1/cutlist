<script lang="ts" setup>
const isExpanded = useIsExpanded();
</script>

<template>
  <div class="fixed inset-0 flex bg-gray-900">
    <ClientOnly>
      <MainSidebar
        v-if="!isExpanded"
        class="bg-gray-50 dark:bg-gray-800 shrink-0 print:hidden min-w-[28rem]"
      />
    </ClientOnly>

    <ClientOnly>
      <div class="flex-1 relative">
        <!-- Cutlist Preview -->
        <div class="absolute inset-0 overflow-auto">
          <CutlistPreview class="min-h-full" />
        </div>

        <!-- Controlls -->
        <div class="absolute bottom-4 right-4 flex gap-4 print:hidden">
          <ScaleController class="bg-white rounded shadow-2xl" />
          <FitController class="bg-white rounded shadow-2xl" />
        </div>
      </div>
    </ClientOnly>
  </div>
</template>
