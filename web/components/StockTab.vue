<script lang="ts" setup>
const { data } = useBoardLayoutsQuery();

const stock = useStock();
</script>

<template>
  <StockMatrixInput v-model="stock" />
</template>
