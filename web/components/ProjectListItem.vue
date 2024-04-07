<script lang="ts" setup>
defineProps<{
  project: Project;
}>();

const emit = defineEmits<{
  open: [id: string];
  delete: [id: string];
}>();
</script>

<template>
  <li class="flex">
    <UButton
      class="flex-1 flex gap-4 !rounded-r-none"
      color="gray"
      @click="emit('open', project.id)"
    >
      <UIcon class="w-6 h-6 opacity-50" name="i-heroicons-cube" />
      <div class="flex-1 text-left">
        <p class="text-lg">{{ project.name }}</p>
        <p class="opacity-50 font-normal">Onshape</p>
      </div>
    </UButton>
    <UButton
      class="aspect-1 justify-center items-center !rounded-l-none"
      color="gray"
      icon="i-heroicons-trash"
      @click="emit('delete', project.id)"
    />
  </li>
</template>
