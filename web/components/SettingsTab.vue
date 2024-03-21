<script lang="ts" setup>
const optimize = useOptimizeForSetting();
const bladeWidth = useBladeWidthSetting();
const distanceUnit = useDistanceUnit();
const showPartNumbers = useShowPartNumbers();
</script>

<template>
  <div class="flex flex-col gap-4">
    <UFormGroup label="Distance unit">
      <USelect v-model="distanceUnit" :options="['in', 'm', 'mm']" />
    </UFormGroup>

    <UFormGroup label="Blade width (in):">
      <UInput v-model="bladeWidth" type="number" />
    </UFormGroup>

    <UFormGroup label="Optimize for:">
      <USelect v-model="optimize" :options="['Cuts', 'Space']" />
    </UFormGroup>

    <UCheckbox v-model="showPartNumbers" label="Show part numbers in preview" />

    <p class="text-sm opacity-50">
      Settings are restored when returning to the website.
    </p>
  </div>
</template>
