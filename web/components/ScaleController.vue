<script lang="ts" setup>
const props = defineProps<{
  scale: number;
}>();

const emit = defineEmits<{
  zoomOut: [];
  zoomIn: [];
  resetZoom: [];
}>();

const percent = computed(() => `${Math.round(props.scale * 100)}%`);
</script>

<template>
  <div class="flex">
    <UButton
      title="Zoom out"
      square
      size="lg"
      color="black"
      icon="i-heroicons-minus"
      @click="emit('zoomOut')"
    />
    <UButton
      :title="`${percent} - Click to reset to 100%`"
      class="w-20 justify-center"
      size="lg"
      color="black"
      @click="emit('resetZoom')"
    >
      {{ percent }}
    </UButton>
    <UButton
      title="Zoom in"
      square
      size="lg"
      color="black"
      icon="i-heroicons-plus"
      @click="emit('zoomIn')"
    />
  </div>
</template>
