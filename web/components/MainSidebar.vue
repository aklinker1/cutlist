<script lang="ts" setup>
import type { Config, Project } from '~~/src';
import { Distance } from '~~/src/units';

const url = useAssemblyUrl();

const { data: doc, isLoading: isLoadingDoc } = useDocumentQuery();

const { data: boardLayouts } = useBoardLayoutsQuery();

const warningsBadge = computed(() => {
  const leftovers = boardLayouts.value?.leftovers ?? [];
  if (leftovers.length === 0) return;
  return leftovers.length;
});

const links = computed(() => [
  {
    label: 'BOM',
    icon: 'i-heroicons-table-cells',
    active: tab.value === 'bom',
    click: () => void (tab.value = 'bom'),
  },
  {
    label: 'Boards',
    icon: 'i-heroicons-truck',
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
          label: warningsBadge.value,
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

const tab = ref<'bom' | 'boards' | 'settings' | 'warnings'>('bom');
</script>

<template>
  <div class="flex flex-col">
    <header class="flex flex-col gap-4 shrink-0">
      <h2
        class="px-8 pt-8 text-2xl font-bold flex items-center justify-center gap-2"
      >
        <UIcon name="i-heroicons-cube" class="text-primary" />
        <span><span class="text-primary">Onshape</span> Cutlist Optimizer</span>
      </h2>

      <UFormGroup class="px-8" label="Assembly URL:">
        <UInput
          v-model="url"
          icon="i-heroicons-magnifying-glass-20-solid"
          size="sm"
          color="white"
          :trailing="false"
          placeholder="Enter URL..."
          :loading="isLoadingDoc"
        />
        <div
          v-if="doc"
          class="py-2 px-3 bg-gray-900 rounded-lg border border-gray-700 mt-2 flex justify-between items-center"
        >
          <p>
            {{ doc.name }}
            <span class="text-sm opacity-50">by {{ doc.owner.name }}</span>
          </p>
          <ULink
            :to="url"
            target="_blank"
            class="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <span>Open</span>
            <UIcon name="i-heroicons-arrow-top-right-on-square" />
          </ULink>
        </div>
      </UFormGroup>

      <UHorizontalNavigation
        :links="links"
        class="px-8 border-b border-gray-200 dark:border-gray-700"
      />
    </header>

    <div class="relative flex-1">
      <div class="absolute inset-0 overflow-auto">
        <BomTab v-if="tab === 'bom'" />
        <WarningsTab v-if="tab === 'warnings'" class="p-8" />
        <SettingsTab v-else-if="tab === 'settings'" class="p-8" />
      </div>
    </div>
  </div>
</template>
