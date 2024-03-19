<script lang="ts" setup>
const { data } = useBoardLayoutsQuery();

const stock = useStock();
</script>

<template>
  <p>Boards:</p>
  <pre>{{ stock }}</pre>
</template>
