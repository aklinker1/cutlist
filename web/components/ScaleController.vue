<script lang="ts" setup>
const scale = useScale();
const { zoomIn, zoomOut, resetZoom } = useScaleControls();

const percent = computed(() => `${Math.round(scale.value * 100)}%`);
</script>

<template>
  <div class="flex">
    <UButton
      title="Zoom out"
      square
      size="lg"
      color="black"
      icon="i-heroicons-minus"
      @click="zoomOut"
    />
    <UButton
      :title="`${percent} - Click to reset to 100%`"
      class="w-20 justify-center"
      size="lg"
      color="black"
      @click="resetZoom"
    >
      {{ percent }}
    </UButton>
    <UButton
      square
      size="lg"
      color="black"
      icon="i-heroicons-plus"
      @click="zoomIn"
    />
  </div>
</template>
