import useDialogState, { type DialogName } from './useDialogState';

export function useModalModel(name: DialogName) {
  const { state, closeDialog } = useDialogState();

  return computed({
    get() {
      return state.value[name] != null;
    },
    set(value) {
      if (!value) closeDialog(name);
    },
  });
}
