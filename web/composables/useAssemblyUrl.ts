export default function () {
  const project = useProject();

  return computed<string | undefined>({
    get() {
      return project.value?.source.url;
    },
    set(value) {
      if (!project.value) return;
      project.value.source.url = value ?? '';
    },
  });
}
