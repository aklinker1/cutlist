<script lang="ts" setup>
const { stock, resetStock } = useProjectSettings();

const projectId = useProjectId();
const { mutate: _save, isPending: isSaving } = useSetSettingsMutation();
function save() {
  console.log('SAVING...');
  _save({
    projectId: projectId.value,
    changes: { stock: stock.value },
  });
}

const { mutate: _reset, isPending: isResetting } = useDeleteSettingsMutation();
function reset() {
  _reset(projectId.value, {
    onSettled: () => resetStock(),
  });
}
</script>

<template>
  <div class="absolute inset-0 flex flex-col p-4 gap-4">
    <StockMatrixInput v-if="stock != null" v-model="stock" />

    <div class="shrink-0 flex flex-row-reverse gap-4">
      <UButton type="submit" :loading="isSaving" @click="save">Save</UButton>
      <UButton color="gray" :loading="isResetting" @click="reset"
        >Reset</UButton
      >
    </div>
  </div>
</template>
