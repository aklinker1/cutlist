<script lang="ts" setup>
import { Distance } from '@aklinker1/cutlist';

const {
  bladeWidth,
  distanceUnit,
  extraSpace,
  optimize,
  showPartNumbers,
  isLoading,
  changes,
  resetSettings: resetLocal,
} = useProjectSettings();

// Convert values when units change
watch(distanceUnit, (newUnit, oldUnit) => {
  if (!newUnit || !oldUnit) return;

  const convertDistance = (value: Ref<string | number | undefined>) => {
    if (value.value == null) return;
    const dist = new Distance(value.value + oldUnit);
    value.value = dist[newUnit];
  };
  convertDistance(bladeWidth);
  convertDistance(extraSpace);
});

const projectId = useProjectId();
const { mutate: _save, isPending: isSaving } = useSetSettingsMutation();
function save() {
  _save({
    projectId: projectId.value,
    changes: toRaw(changes.value),
  });
}

const { mutate: _reset, isPending: isResetting } = useDeleteSettingsMutation();
function reset() {
  _reset(projectId.value, {
    onSettled: () => resetLocal(),
  });
}
</script>

<template>
  <form v-if="!isLoading" class="flex flex-col gap-4" @submit.prevent="save">
    <UFormGroup label="Distance unit">
      <USelect v-model="distanceUnit" :options="['in', 'm', 'mm']" />
    </UFormGroup>

    <UFormGroup :label="`Blade width (${distanceUnit}):`">
      <UInput v-model="bladeWidth" type="number" min="0" step="0.00001" />
    </UFormGroup>

    <UFormGroup :label="`Extra space (${distanceUnit}):`">
      <UInput v-model="extraSpace" type="number" />
    </UFormGroup>

    <UFormGroup label="Optimize for:">
      <USelect v-model="optimize" :options="['Cuts', 'Space']" />
    </UFormGroup>

    <UCheckbox v-model="showPartNumbers" label="Show part numbers in preview" />

    <div class="flex flex-row-reverse gap-4">
      <UButton type="submit" :loading="isSaving">Save Changes</UButton>
      <UButton color="gray" :loading="isResetting" @click="reset"
        >Reset</UButton
      >
    </div>
  </form>
</template>
