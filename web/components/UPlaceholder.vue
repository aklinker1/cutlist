<script lang="ts" setup>
defineProps<{
  color?: 'white' | 'primary';
}>();
</script>

<template>
  <div
    class="border border-dashed rounded relative"
    :class="{
      'border-white border-opacity-40': color == null || color === 'white',
      'border-primary': color === 'primary',
    }"
  >
    <div
      class="absolute inset-0.5 placeholder-bg"
      :class="{
        'color-primary': color === 'primary',
      }"
    />
    <slot />
  </div>
</template>

<style scoped>
.placeholder-bg {
  --gradient-color: rgba(255, 255, 255, 20%);
  background-size: 10px 10px;
  background-image: linear-gradient(
      135deg,
      transparent,
      transparent 5px,
      var(--gradient-color) 5px,
      var(--gradient-color) 6px,
      transparent 6px,
      transparent
    ),
    linear-gradient(
      135deg,
      transparent,
      transparent 12px,
      var(--gradient-color) 12px,
      var(--gradient-color) 13px,
      transparent 13px,
      transparent
    );
}
.placeholder-bg.color-primary {
  --gradient-color: rgb(var(--color-primary-DEFAULT) / 0.5);
}
</style>
