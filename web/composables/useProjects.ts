import type { Project } from '~/utils/projects';

export default createGlobalState(() =>
  useLocalStorage<Project[]>('@cutlist/projects', []),
);
