<script lang="ts" setup>
defineProps<{
  to: string;
  name?: string;
  hideClose?: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const route = useRoute();
</script>

<template>
  <li
    class="bg-gray-100 dark:bg-gray-900 border-r border-gray-300 dark:border-gray-800"
  >
    <ULink
      class="px-3 flex shrink-0 h-12 justify-between items-center gap-3"
      active-class="bg-gray-300 dark:bg-gray-800"
      :to="to"
      :active="route.path === to"
      :title="name"
    >
      <slot />
      <span
        v-if="name"
        class="min-w-[6rem] max-w-[12rem] truncate text-sm font-medium"
        >{{ name }}</span
      >
      <UButton
        v-if="!hideClose"
        size="2xs"
        icon="i-heroicons-x-mark"
        color="white"
        variant="soft"
        square
        :ui="{ rounded: 'rounded-full' }"
        title="Close"
        @click.stop.prevent="emit('close')"
      />
    </ULink>
  </li>
</template>
