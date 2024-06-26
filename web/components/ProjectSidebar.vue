<script lang="ts" setup>
import type { HorizontalNavigationLink } from '#ui/types';

const { data: boardLayouts, isFetching: isFetchingLayouts } =
  useBoardLayoutsQuery();
const refresh = useRefreshOnshapeQueries();

const warningsBadge = computed(() => {
  const leftovers = boardLayouts.value?.leftovers ?? [];
  if (leftovers.length === 0) return;
  return leftovers.length;
});

const links = computed<HorizontalNavigationLink[]>(() => [
  {
    label: 'BOM',
    icon: 'i-heroicons-table-cells',
    active: tab.value === 'bom',
    click: () => void (tab.value = 'bom'),
  },
  {
    label: 'Boards',
    icon: 'i-fluent-emoji-high-contrast-wood',
    active: tab.value === 'boards',
    click: () => void (tab.value = 'boards'),
  },
  {
    label: 'Warnings',
    icon: 'i-heroicons-exclamation-triangle',
    active: tab.value === 'warnings',
    badge: warningsBadge.value
      ? {
          color: 'yellow',
          label: String(warningsBadge.value),
        }
      : undefined,
    click: () => void (tab.value = 'warnings'),
  },
  {
    label: 'Settings',
    icon: 'i-heroicons-cog-6-tooth',
    active: tab.value === 'settings',
    click: () => void (tab.value = 'settings'),
  },
]);

const tab = useProjectTab();

const project = useProject();
const editProject = useEditProject();
</script>

<template>
  <div class="flex flex-col">
    <header class="flex flex-col shrink-0">
      <div
        v-if="project"
        class="mx-2 mt-2 p-2 pl-3 flex gap-2 items-center print:m-0 print:p-0"
      >
        <OnshapeProjectDetails :url="project.source.url" />

        <UButton
          class="print:hidden"
          title="Get latest parts from Onshape"
          :icon="isFetchingLayouts ? undefined : 'i-heroicons-arrow-path'"
          color="gray"
          size="sm"
          :loading="isFetchingLayouts"
          @click="refresh"
        />
        <UButton
          class="print:hidden"
          title="Change Project Source"
          icon="i-heroicons-pencil"
          color="gray"
          size="sm"
          @click="editProject(project)"
        />
      </div>

      <!-- Print-only BOM list -->
      <BomTab class="hidden print:block mt-4 page-break-after" />

      <UHorizontalNavigation
        :links="links"
        class="pl-2 border-b border-gray-200 dark:border-gray-700 print:hidden"
      />
    </header>

    <div class="relative flex-1">
      <div class="absolute inset-0 overflow-auto">
        <BomTab v-if="tab === 'bom'" />
        <StockTab v-else-if="tab === 'boards'" />
        <WarningsTab v-else-if="tab === 'warnings'" class="p-8" />
        <SettingsTab v-else-if="tab === 'settings'" class="p-8" />
      </div>
    </div>
  </div>
</template>
