<script lang="ts" setup>
const openIds = useOpenProjectIds();
const projects = useProjects();

const tabs = computed(() =>
  openIds.value.map((id) => {
    const project = projects.value.find((p) => p.id == id);
    return {
      id,
      name: project?.name ?? id,
      to: `/p/${id}`,
    };
  }),
);

const closeTab = useCloseTab();
</script>

<template>
  <div class="fixed inset-0 flex flex-col">
    <TabList class="shrink-0">
      <!-- Home Link -->
      <TabListItem to="/" hide-close class="sticky left-0">
        <UIcon name="i-heroicons-home-solid" class="w-6" />
      </TabListItem>

      <!-- Projects -->
      <TabListItem
        v-for="tab in tabs"
        :key="tab.id"
        :name="tab.name"
        :to="tab.to"
        @close="closeTab(tab.id)"
      />
    </TabList>
    <div class="flex-1 relative">
      <div class="absolute inset-0 overflow-hidden">
        <slot />
      </div>
    </div>
  </div>

  <Teleport to="body">
    <AddProjectDialog />
  </Teleport>
</template>

<style>
.page-break-after {
  page-break-after: always;
}
</style>
