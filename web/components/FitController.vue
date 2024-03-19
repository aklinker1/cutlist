<script lang="ts" setup>
const isExpanded = useIsExpanded();
</script>

<template>
  <div class="flex">
    <UButton
      title="Expand Preview"
      square
      size="lg"
      color="black"
      :icon="
        isExpanded
          ? 'i-heroicons-arrows-pointing-in'
          : 'i-heroicons-arrows-pointing-out'
      "
      @click="isExpanded = !isExpanded"
    />
  </div>
</template>
