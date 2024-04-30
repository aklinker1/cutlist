export default function () {
  const project = useProject();
  return computed(() => project.value?.id);
}
