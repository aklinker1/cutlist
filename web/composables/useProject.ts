export default function () {
  const route = useRoute();
  const id = computed(() => route.params.id as string | undefined);
  const projects = useProjects();

  return computed(() => projects.value.find((p) => p.id === id.value));
}
