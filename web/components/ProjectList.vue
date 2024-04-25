<script lang="ts" setup>
const createNewProject = useCreateNewProject();

const { data: projects, isFetching } = useProjectListQuery();
const filter = ref('');
const filteredProjects = useArrayFilter(projects, (p) =>
  p.name.toLowerCase().includes(filter.value.toLowerCase()),
);

const openProject = useOpenProject();
const deleteProject = useDeleteProject();
</script>

<template>
  <ul class="flex flex-col gap-2">
    <li>
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
    <li v-if="isFetching" class="flex justify-center">
      <UButton
        class="pointer-events-none"
        loading
        variant="ghost"
        color="white"
        disabled
      >
        Loading...
      </UButton>
    </li>
    <li v-else-if="filteredProjects.length === 0" class="text-center py-16">
      No projects,
      <ULink variant="link" @click="createNewProject">add one</ULink>
    </li>
    <slot />
  </ul>
</template>
