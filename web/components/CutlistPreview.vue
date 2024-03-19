<script lang="ts" setup>
const { data, isLoading, error } = useBoardLayoutsQuery();
</script>

<template>
  <div class="flex flex-col bg">
    <p v-if="error">{{ error }}</p>
    <template v-else-if="data">
      <p
        v-if="data.layouts.length === 0"
        class="m-auto bg-gray-900 shadow-2xl shadow-gray-900 p-4"
      >
        No board layouts found
      </p>
      <LayoutList v-else :layouts="data.layouts" />
    </template>

    <div v-else-if="isLoading" class="m-auto flex items-center space-x-4">
      <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
      <div class="space-y-2">
        <USkeleton class="h-4 w-[250px]" />
        <USkeleton class="h-4 w-[200px]" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg {
  background-size: 40px 40px;
  background-image: radial-gradient(
    circle,
    rgba(255, 255, 255, 20%) 2px,
    rgba(255, 255, 255, 0) 1px
  );
}
</style>
