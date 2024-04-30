import type { Project } from '../projects';
import {
  DEFAULT_SETTINGS,
  type AccountService,
  type AccountSettings,
} from './AccountService';

export function createLocalAccountService(): AccountService {
  const _settingsStorageKeys: Record<keyof AccountSettings, string> = {
    bladeWidth: '@cutlist/blade-width',
    distanceUnit: '@cutlist/distance-unit',
    extraSpace: '@cutlist/extra-space',
    optimize: '@cutlist/optimize',
    showPartNumbers: '@cutlist/use-part-numbers',
    stock: '@cutlist/stock',
  };
  const projectsStorageKey = '@cutlist/projects';

  const getKey = <T extends keyof AccountSettings>(
    key: T,
    projectId: string | undefined,
  ) => {
    if (projectId == null) return _settingsStorageKeys[key];
    return `${_settingsStorageKeys[key]}?id=${projectId}`;
  };

  const parseNumber = (str: string | null): number | undefined => {
    const v = Number(str ?? undefined);
    if (isNaN(v)) return undefined;
    return v;
  };
  const parseBoolean = (str: string | null): boolean | undefined => {
    if (str == null) return undefined;
    return str === 'true';
  };

  const getSettings = (projectId: string | undefined): AccountSettings => {
    const settings: Partial<AccountSettings> = {};

    const bladeWidth = parseNumber(
      localStorage.getItem(getKey('bladeWidth', projectId)),
    );
    if (bladeWidth != null) settings.bladeWidth = bladeWidth;

    const extraSpace = parseNumber(
      localStorage.getItem(getKey('extraSpace', projectId)),
    );
    if (extraSpace != null) settings.extraSpace = extraSpace;

    const optimize = localStorage.getItem(getKey('optimize', projectId));
    if (optimize != null)
      settings.optimize = optimize as AccountSettings['optimize'];

    const showPartNumbers = parseBoolean(
      localStorage.getItem(getKey('showPartNumbers', projectId)),
    );
    if (showPartNumbers != null) settings.showPartNumbers = showPartNumbers;

    const distanceUnit = localStorage.getItem(
      getKey('distanceUnit', projectId),
    );
    if (distanceUnit != null)
      settings.distanceUnit = distanceUnit as AccountSettings['distanceUnit'];

    return {
      ...DEFAULT_SETTINGS,
      ...settings,
    };
  };

  const listProjects = (): Project[] => {
    const str = localStorage.getItem(projectsStorageKey);
    return str ? JSON.parse(str) : [];
  };
  const saveProjects = (projects: Project[]) => {
    localStorage.setItem(projectsStorageKey, JSON.stringify(projects));
  };

  return {
    id: 'local',
    async getSettings(projectId) {
      return getSettings(projectId);
    },
    async setSettings(projectId, changes) {
      Object.entries(changes).forEach(([key, value]) => {
        const localStorageKey = getKey(key as keyof AccountSettings, projectId);
        if (!localStorageKey) return;

        localStorage.setItem(localStorageKey, String(value));
      });
    },
    async deleteSettings(projectId) {
      Object.keys(_settingsStorageKeys).forEach((key) =>
        localStorage.removeItem(
          getKey(key as keyof AccountSettings, projectId),
        ),
      );
    },
    async listProjects() {
      return listProjects();
    },
    async removeProject(id) {
      const newProjects = listProjects().filter((p) => p.id !== id);
      saveProjects(newProjects);
    },
    async saveProject(newProject) {
      const newProjects = listProjects();
      newProjects.push(newProject);
      saveProjects(newProjects);
    },
  };
}
