<script lang="ts" setup>
const isExpanded = useIsExpanded();
</script>

<template>
  <div class="absolute inset-0 flex bg-white dark:bg-gray-900 print:block">
    <ClientOnly>
      <ProjectSidebar
        v-if="!isExpanded"
        class="bg-gray-50 dark:bg-gray-800 shrink-0 min-w-[28rem] relative z-10"
      />
    </ClientOnly>

    <ClientOnly>
      <CutlistPreview class="flex-1 relative z-0 dots-bg" />
    </ClientOnly>
  </div>
</template>

<style scoped>
.dots-bg {
  --dots-color: 0 0 0;
  background-size: 40px 40px;
  background-image: radial-gradient(
    circle,
    rgba(var(--dots-color) / 20%) 2px,
    rgba(var(--dots-color) / 0) 1px
  );
}

.dark .dots-bg {
  --dots-color: 255 255 255;
}
</style>
