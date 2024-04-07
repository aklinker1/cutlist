<script lang="ts" setup>
import type { HorizontalNavigationLink } from '#ui/types';

const url = useAssemblyUrl();

const { data: doc, isFetching: isFetchingDoc } = useDocumentQuery();
const { isFetching: isFetchingLayouts } = useBoardLayoutsQuery();

const refresh = useRefreshOnshapeQueries();

const { data: boardLayouts } = useBoardLayoutsQuery();

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
    label: 'Stock',
    icon: 'i-heroicons-truck',
    active: tab.value === 'stock',
    click: () => void (tab.value = 'stock'),
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

const tab = ref<'bom' | 'stock' | 'settings' | 'warnings'>('bom');
</script>

<template>
  <div class="flex flex-col">
    <header class="flex flex-col shrink-0">
      <div
        v-if="doc"
        class="mx-2 mt-2 p-2 pl-3 flex gap-2 items-start print:m-0 print:p-0"
      >
        <div class="flex-1 page-break-after">
          <h1 class="text-lg font-medium">{{ doc.name }}</h1>
          <p class="text-sm opacity-50">by {{ doc.owner.name }}</p>
          <a
            class="text-sm opacity-50 hidden print:block"
            :href="url"
            target="_blank"
            >{{ url }}</a
          >
        </div>

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
          title="Open in Onshape"
          :to="url"
          target="_blank"
          icon="i-heroicons-arrow-top-right-on-square"
          color="gray"
          size="sm"
        />
        <UButton
          class="print:hidden"
          title="Change Project Source"
          icon="i-heroicons-pencil"
          color="gray"
          size="sm"
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
        <StockTab v-else-if="tab === 'stock'" />
        <WarningsTab v-else-if="tab === 'warnings'" class="p-8" />
        <SettingsTab v-else-if="tab === 'settings'" class="p-8" />
      </div>
    </div>
  </div>
</template>
