<script lang="ts" setup>
const createNewProject = useCreateNewProject();

const projects = useProjects();
const openProject = useOpenProject();
const deleteProject = useDeleteProject();
</script>

<template>
  <div class="bg-gray-200 dark:bg-gray-800 h-full p-8 flex">
    <div class="w-full max-w-lg mx-auto flex flex-col gap-8">
      <div class="flex">
        <h1 class="flex-1 text-2xl font-medium">Projects</h1>
        <UButton
          class="shrink-0"
          icon="i-heroicons-plus"
          @click="createNewProject"
          >New</UButton
        >
      </div>
      <ClientOnly>
        <ul class="flex flex-col gap-2">
          <ProjectListItem
            v-for="project of projects"
            :key="project.id"
            :project
            @open="openProject"
            @delete="deleteProject"
          />
          <li class="text-sm opacity-50 text-center py-4">
            {{ projects.length }} projects
          </li>
        </ul>
      </ClientOnly>
    </div>
  </div>
</template>
