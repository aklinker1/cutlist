<script lang="ts" setup>
import { Distance } from '@aklinker1/cutlist';

const optimize = useOptimizeForSetting();
const bladeWidth = useBladeWidthSetting();
const distanceUnit = useDistanceUnit();
const showPartNumbers = useShowPartNumbers();
const extraSpace = useExtraSpaceSetting();

// Convert values when units change
watch(distanceUnit, (newUnit, oldUnit) => {
  if (!newUnit || !oldUnit) return;

  const convertValue = (value: Ref<string | number>) => {
    const dist = new Distance(value.value + oldUnit);
    value.value = dist[newUnit];
  };
  convertValue(bladeWidth);
  convertValue(extraSpace);
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <UFormGroup label="Distance unit">
      <USelect v-model="distanceUnit" :options="['in', 'm', 'mm']" />
    </UFormGroup>

    <UFormGroup :label="`Blade width (${distanceUnit}):`">
      <UInput v-model="bladeWidth" type="number" />
    </UFormGroup>

    <UFormGroup :label="`Extra space (${distanceUnit}):`">
      <UInput v-model="extraSpace" type="number" />
    </UFormGroup>

    <UFormGroup label="Optimize for:">
      <USelect v-model="optimize" :options="['Cuts', 'Space']" />
    </UFormGroup>

    <UCheckbox v-model="showPartNumbers" label="Show part numbers in preview" />

    <p class="text-sm opacity-50 text-center pt-8">
      Settings are saved when returning to the website.
    </p>
  </div>
</template>
