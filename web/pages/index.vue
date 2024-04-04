<script lang="ts" setup>
const isExpanded = useIsExpanded();
</script>

<template>
  <div class="fixed inset-0 flex bg-gray-900">
    <ClientOnly>
      <MainSidebar
        v-if="!isExpanded"
        class="bg-gray-50 dark:bg-gray-800 shrink-0 print:hidden min-w-[28rem] relative z-10"
      />
    </ClientOnly>

    <ClientOnly>
      <CutlistPreview class="flex-1 relative z-0 dots-bg" />
    </ClientOnly>
  </div>
</template>

<style scoped>
.dots-bg {
  background-size: 40px 40px;
  background-image: radial-gradient(
    circle,
    rgba(255, 255, 255, 20%) 2px,
    rgba(255, 255, 255, 0) 1px
  );
}
</style>
