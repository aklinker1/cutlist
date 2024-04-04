<script lang="ts" setup>
import type {
  BoardLayoutLeftover,
  BoardLayoutPlacement,
} from '@aklinker1/cutlist';

const props = defineProps<{
  part: BoardLayoutLeftover;
  placement?: BoardLayoutPlacement;
}>();

const width = useFormattedDistance(() => props.part.widthM);
const length = useFormattedDistance(() => props.part.lengthM);
const thickness = useFormattedDistance(() => props.part.thicknessM);

const top = useFormattedDistance(() => props.placement?.topM);
const left = useFormattedDistance(() => props.placement?.leftM);
const right = useFormattedDistance(() => props.placement?.rightM);
const bottom = useFormattedDistance(() => props.placement?.bottomM);
</script>

<template>
  <div>
    <h3 class="text-lg text-primary">
      {{ part.partNumber }}.{{ part.instanceNumber }} {{ part.name }}
    </h3>
    <table class="font-mono">
      <tr>
        <td class="opacity-50">Width</td>
        <td class="opacity-50 whitespace-pre">{{ ' = ' }}</td>
        <td>{{ width }}</td>
      </tr>
      <tr>
        <td class="opacity-50">Length</td>
        <td class="opacity-50 whitespace-pre">{{ ' = ' }}</td>
        <td>{{ length }}</td>
      </tr>
      <tr>
        <td class="opacity-50">Thick</td>
        <td class="opacity-50 whitespace-pre">{{ ' = ' }}</td>
        <td>{{ thickness }}</td>
      </tr>
      <template v-if="placement">
        <tr>
          <td class="opacity-50">Left</td>
          <td class="opacity-50 whitespace-pre">{{ ' = ' }}</td>
          <td>{{ left }}</td>
        </tr>
        <tr>
          <td class="opacity-50">Top</td>
          <td class="opacity-50 whitespace-pre">{{ ' = ' }}</td>
          <td>{{ top }}</td>
        </tr>
        <tr>
          <td class="opacity-50">Right</td>
          <td class="opacity-50 whitespace-pre">{{ ' = ' }}</td>
          <td>{{ right }}</td>
        </tr>
        <tr>
          <td class="opacity-50">Bottom</td>
          <td class="opacity-50 whitespace-pre">{{ ' = ' }}</td>
          <td>{{ bottom }}</td>
        </tr>
      </template>
    </table>
  </div>
</template>
