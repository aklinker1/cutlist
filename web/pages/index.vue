<script lang="ts" setup>
const createNewProject = useCreateNewProject();

const projects = useProjects();
const filter = ref('');
const filteredProjects = useArrayFilter(projects, (p) =>
  p.name.toLowerCase().includes(filter.value.toLowerCase()),
);

const openProject = useOpenProject();
const deleteProject = useDeleteProject();
</script>

<template>
  <div class="bg-gray-200 dark:bg-gray-800 h-full p-8 flex">
    <div class="w-full max-w-lg mx-auto flex flex-col gap-8">
      <div class="flex gap-2">
        <h1 class="flex-1 text-2xl font-medium line-clamp-1 truncate">
          Projects
        </h1>
        <UButton
          class="shrink-0"
          icon="i-heroicons-plus"
          @click="createNewProject"
          >New</UButton
        >
      </div>
      <ClientOnly>
        <ul class="flex flex-col gap-2">
          <li v-if="projects.length">
            <UInput
              v-model="filter"
              placeholder="Filter projects..."
              icon="i-heroicons-magnifying-glass"
            />
          </li>
          <ProjectListItem
            v-for="project of filteredProjects"
            :key="project.id"
            :project
            @open="openProject"
            @delete="deleteProject"
          />
          <li v-if="filteredProjects.length === 0" class="text-center py-16">
            No projects,
            <ULink variant="link" @click="createNewProject">add one</ULink>
          </li>
        </ul>
      </ClientOnly>
    </div>
  </div>
</template>
