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
    <header class="flex flex-col gap-4 shrink-0">
      <div class="px-8 pt-8">
        <h2 class="text-2xl font-bold flex items-center justify-center gap-2">
          <UIcon name="i-noto-wood" class="text-primary" />
          <span class="text-primary">Onshape</span> Cutlist Generator
        </h2>
        <div class="flex gap-2 items-center justify-center opacity-50">
          <ULink
            class="underline"
            color="black"
            variant="ghost"
            square
            to="https://github.com/aklinker1/cutlist/wiki"
            target="_blank"
          >
            User Manual
          </ULink>
          <span>&bull;</span>
          <ULink
            class="underline"
            color="black"
            variant="ghost"
            square
            to="https://github.com/aklinker1/cutlist"
            target="_blank"
          >
            GitHub
          </ULink>
        </div>
      </div>

      <UFormGroup class="px-8" label="Assembly URL:">
        <UInput
          v-model="url"
          icon="i-heroicons-magnifying-glass-20-solid"
          size="sm"
          color="white"
          :trailing="false"
          placeholder="Enter URL..."
          :loading="isFetchingDoc"
        />
        <div
          v-if="doc"
          class="p-2 pl-3 bg-gray-900 rounded-lg border border-gray-700 mt-2 flex justify-between items-center"
        >
          <p>
            {{ doc.name }}
            <span class="text-sm opacity-50">by {{ doc.owner.name }}</span>
          </p>
          <div class="flex items-center gap-2">
            <UButton
              title="Get latest parts from Onshape"
              :icon="isFetchingLayouts ? undefined : 'i-heroicons-arrow-path'"
              color="gray"
              size="sm"
              :loading="isFetchingLayouts"
              @click="refresh"
            />
            <UButton
              title="Open in Onshape"
              :to="url"
              target="_blank"
              icon="i-heroicons-arrow-top-right-on-square"
              color="gray"
              size="sm"
            />
          </div>
        </div>
      </UFormGroup>

      <UHorizontalNavigation
        :links="links"
        class="pl-8 border-b border-gray-200 dark:border-gray-700"
      />
    </header>

    <div class="relative flex-1">
      <div class="absolute inset-0 overflow-auto">
        <BomTab v-if="tab === 'bom'" />
        <StockTab v-if="tab === 'stock'" />
        <WarningsTab v-if="tab === 'warnings'" class="p-8" />
        <SettingsTab v-else-if="tab === 'settings'" class="p-8" />
      </div>
    </div>
  </div>
</template>
