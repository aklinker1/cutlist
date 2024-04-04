<script lang="ts" setup>
import type { BoardLayout } from '@aklinker1/cutlist';
import { Distance } from '@aklinker1/cutlist';

defineProps<{
  layouts: BoardLayout[];
}>();

const gap = usePx(new Distance('4 in').m);
</script>

<template>
  <ul class="flex m-16" :style="`gap:${gap}`">
    <LayoutListItem v-for="layout of layouts" :layout="layout" />
  </ul>
</template>
