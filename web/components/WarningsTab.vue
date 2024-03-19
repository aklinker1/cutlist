<script lang="ts" setup>
const { data } = useBoardLayoutsQuery();
</script>

<template>
  <ul class="flex flex-col gap-4">
    <LeftoverListItem v-for="part of data?.leftovers" :part="part" />
  </ul>
</template>
