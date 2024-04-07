export default createGlobalState(() => {
  const state = ref<DialogState>({});
  const openDialog = <T extends DialogName>(
    name: T,
    props: GetDialogProps<T>,
  ) => {
    state.value = {
      ...state.value,
      [name]: props,
    };
  };
  const closeDialog = <T extends DialogName>(name: T) => {
    state.value = {
      ...state.value,
      [name]: undefined,
    };
  };

  return {
    state,
    openDialog,
    closeDialog,
  };
});

export interface DialogDefinition {
  'add-project': {
    title: string;
    onAdd: (project: Project) => void;
    onCancel: () => void;
  };
}
export type DialogName = keyof DialogDefinition;
export type GetDialogProps<T extends DialogName> = DialogDefinition[T];
export type DialogState = Partial<DialogDefinition>;
