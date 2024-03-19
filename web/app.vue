<script lang="ts" setup>
import { type Config, type Project } from '~~/src';
import { createCutlistGenerator } from '~~/src';
import { Distance } from '~~/src/units';

const isExpanded = useIsExpanded();

const url = useLocalStorage('@cutlist/document-url', '');
const optimize = useLocalStorage('@cutlist/optimize', 'Cuts');
const bladeWidth = useLocalStorage('@cutlist/blade-width', '0.125');

const urlValues = computed(() => {
  try {
    const path = new URL(url.value).pathname;
    const matches =
      /^\/documents\/(?<did>.*?)\/.*?\/(?<wvmid>.*?)\/e\/(?<eid>.*?)$/.exec(
        path,
      );
    return matches?.groups;
  } catch {
    return;
  }
});

const { parts, isLoading, error } = useParts(
  computed(() => urlValues.value?.did),
  computed(() => urlValues.value?.eid),
  computed(() => new Distance(bladeWidth.value + 'in').m),
  computed(() => (optimize.value === 'Cuts' ? 'cuts' : 'space')),
);
</script>

<template>
  <div class="fixed inset-0 flex bg-gray-900">
    <div
      v-if="!isExpanded"
      class="bg-gray-50 dark:bg-gray-800 shrink-0 print:hidden"
    >
      <header class="p-8 border-b border-gray-600">
        <h2
          class="pb-4 text-2xl font-bold flex items-center justify-center gap-2"
        >
          <UIcon name="i-heroicons-cube" class="text-primary" />
          <span
            ><span class="text-primary">Onshape</span> Cutlist Optimizer</span
          >
        </h2>

        <UFormGroup label="Assembly URL:">
          <UInput
            v-model="url"
            icon="i-heroicons-magnifying-glass-20-solid"
            size="sm"
            color="white"
            :trailing="false"
            placeholder="Enter URL..."
          />
        </UFormGroup>

        <div class="flex gap-4 justify-center w-full pt-2">
          <UFormGroup class="flex-1" label="Optimize for:">
            <USelect v-model="optimize" :options="['Cuts', 'Space']" />
          </UFormGroup>
          <UFormGroup class="flex-1" label="Blade width (in):">
            <UInput v-model="bladeWidth" type="number" />
          </UFormGroup>
        </div>
      </header>
    </div>

    <div class="flex-1 relative">
      <div class="absolute inset-0 overflow-auto">
        <div class="min-h-full flex flex-col bg">
          <p v-if="error">{{ error }}</p>
          <template v-else-if="parts">
            <LayoutList :layouts="parts.layouts" />
            <p v-if="parts.leftovers.length">
              LEFTOVERS: {{ parts.leftovers }}
            </p>
          </template>
          <div v-else class="m-auto flex items-center space-x-4">
            <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
            <div class="space-y-2">
              <USkeleton class="h-4 w-[250px]" />
              <USkeleton class="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      </div>

      <div class="absolute bottom-4 right-4 flex gap-4 print:hidden">
        <ScaleController class="bg-white rounded shadow-2xl" />
        <FitController class="bg-white rounded shadow-2xl" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg {
  background-size: 40px 40px;
  background-image: radial-gradient(
    circle,
    rgba(255, 255, 255, 20%) 2px,
    rgba(255, 255, 255, 0) 1px
  );
}
</style>
