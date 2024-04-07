<script lang="ts" setup>
import { nanoid } from 'nanoid/non-secure';

const isOpen = useModalModel('add-project');

const { state, closeDialog: _closeDialog } = useDialogState();
const props = computed(() => state.value['add-project']);

const name = ref('');
const url = ref('');

const closeDialog = () => _closeDialog('add-project');

const submit = () => {
  if (props.value == null) return;

  props.value.onAdd({
    id: nanoid(),
    name: name.value,
    source: { type: 'onshape', url: url.value },
  });
  closeDialog();
};

const dismiss = () => {
  if (props.value == null) return;

  props.value.onCancel();
  closeDialog();
};
</script>

<template>
  <UModal v-model="isOpen">
    <form v-if="props" @submit.prevent.stop="submit">
      <UCard>
        <template #header>{{ props.title }}</template>

        <div class="flex flex-col gap-4">
          <UFormGroup label="Name" required>
            <UInput type="text" placeholder="Enter a name..." v-model="name" />
          </UFormGroup>

          <UFormGroup label="Onshape Assembly URL" required>
            <UInput
              type="text"
              placeholder="Enter a url..."
              v-model="url"
              icon="i-heroicons-globe-alt"
            />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex flex-row-reverse gap-4">
            <UButton type="submit">Save</UButton>
            <UButton color="gray" @click="dismiss">Cancel</UButton>
          </div>
        </template>
      </UCard>
    </form>
  </UModal>
</template>
