import type { Tab } from './useProjectTabMap';

export default function () {
  const project = useProject();
  const map = useProjectTabMap();

  return computed<Tab>({
    get() {
      if (project.value == null) return 'bom';
      return map.value[project.value.id] ?? 'bom';
    },
    set(value) {
      if (project.value == null) return;
      map.value[project.value.id] = value;
    },
  });
}
