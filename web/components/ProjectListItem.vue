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
  <li>
    <UButtonGroup class="flex">
      <UButton
        class="flex-1 flex gap-4"
        color="gray"
        @click="emit('open', project.id)"
      >
        <UIcon class="w-6 h-6 ml-2 opacity-50" name="i-heroicons-cube" />
        <div class="flex-1 text-left">
          <p class="text-lg line-clamp-1">{{ project.name }}</p>
          <p class="opacity-50 font-normal line-clamp-1">Onshape</p>
        </div>
      </UButton>
      <UButton
        class="justify-center items-center w-12"
        color="gray"
        icon="i-heroicons-x-mark"
        title="Remove from list"
        @click="emit('delete', project.id)"
      />
    </UButtonGroup>
  </li>
</template>
