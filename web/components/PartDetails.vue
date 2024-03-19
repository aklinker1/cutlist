<script lang="ts" setup>
const props = defineProps<{
  part: PartToCut;
  placement?: Rectanble<any>;
}>();

const width = useFormattedDistance(() => props.part.size.width);
const length = useFormattedDistance(() => props.part.size.length);
const thickness = useFormattedDistance(() => props.part.size.thickness);

const top = useFormattedDistance(() => props.placement?.top);
const left = useFormattedDistance(() => props.placement?.left);
const right = useFormattedDistance(() => props.placement?.right);
const bottom = useFormattedDistance(() => props.placement?.bottom);
</script>

<template>
  <div>
    <h3 class="text-lg text-primary">
      {{ part.partNumber }}.{{ part.instanceNumber }} {{ part.name }}
    </h3>
    <table class="font-mono">
      <tr>
        <th>W=</th>
        <td>{{ width }}</td>
      </tr>
      <tr>
        <th>L=</th>
        <td>{{ length }}</td>
      </tr>
      <tr>
        <th>T=</th>
        <td>{{ thickness }}</td>
      </tr>
      <template v-if="placement">
        <tr>
          <th>LEFT=</th>
          <td>{{ left }}</td>
        </tr>
        <tr>
          <th>TOP=</th>
          <td>{{ top }}</td>
        </tr>
        <tr>
          <th>RIGHT=</th>
          <td>{{ right }}</td>
        </tr>
        <tr>
          <th>BOTTOM=</th>
          <td>{{ bottom }}</td>
        </tr>
      </template>
    </table>
  </div>
</template>
