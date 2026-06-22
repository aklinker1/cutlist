<script lang="ts" setup>
const openIds = useOpenProjectIds();
const { data: projects } = useProjectListQuery();

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
  <div class="fixed inset-0 flex flex-col print:static print:block">
    <ul class="shrink-0 flex print:hidden">
      <!-- Home Link -->
      <TabListItem to="/" hide-close class="sticky left-0">
        <UIcon name="i-heroicons-home-solid" class="h-4 w-6" />
      </TabListItem>

      <TabList class="flex-1">
        <!-- Projects -->
        <ClientOnly>
          <TabListItem
            v-for="tab in tabs"
            :key="tab.id"
            :name="tab.name"
            :to="tab.to"
            @close="closeTab(tab.id)"
          />
        </ClientOnly>
      </TabList>

      <!-- Account -->
      <ClientOnly>
        <ProfileTab />
      </ClientOnly>
    </ul>
    <div class="flex-1 relative print:static">
      <div
        class="absolute inset-0 overflow-hidden print:static print:overflow-visible"
      >
        <slot />
      </div>
    </div>
  </div>

  <Teleport to="body">
    <AddProjectDialog />
  </Teleport>
</template>

<style>
@media print {
  @page {
    margin: 0.4in;
  }
}

.page-break-after {
  page-break-after: always;
}

* {
  min-width: 0;
}
</style>
