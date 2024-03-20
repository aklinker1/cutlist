<script lang="ts" setup>
const { data } = useBoardLayoutsQuery();

const stock = useStock();
</script>

<template>
  <div>
    <p>Boards:</p>
    <pre>{{ stock }}</pre>
  </div>
</template>
