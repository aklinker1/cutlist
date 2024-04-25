import type { Project } from '../projects';
import {
  DEFAULT_SETTINGS,
  type AccountService,
  type AccountSettings,
} from './AccountService';

export function createLocalAccountService(): AccountService {
  const settingsStorageKeys: Record<keyof AccountSettings, string> = {
    bladeWidth: '@cutlist/blade-width',
    distanceUnit: '@cutlist/distance-unit',
    extraSpace: '@cutlist/extra-space',
    optimize: '@cutlist/optimize',
    showPartNumbers: '@cutlist/use-part-numbers',
  };
  const projectsStorageKey = '@cutlist/projects';

  const parseNumber = (str: string | null): number | undefined => {
    const v = Number(str ?? undefined);
    if (isNaN(v)) return undefined;
    return v;
  };
  const parseBoolean = (str: string | null): boolean | undefined => {
    if (str == null) return undefined;
    return str === 'true';
  };

  const getSettings = (): AccountSettings => {
    const settings: Partial<AccountSettings> = {};

    const bladeWidth = parseNumber(
      localStorage.getItem(settingsStorageKeys.bladeWidth),
    );
    if (bladeWidth != null) settings.bladeWidth = bladeWidth;

    const extraSpace = parseNumber(
      localStorage.getItem(settingsStorageKeys.extraSpace),
    );
    if (extraSpace != null) settings.extraSpace = extraSpace;

    const optimize = localStorage.getItem(settingsStorageKeys.optimize);
    if (optimize != null)
      settings.optimize = optimize as AccountSettings['optimize'];

    const showPartNumbers = parseBoolean(
      localStorage.getItem(settingsStorageKeys.showPartNumbers),
    );
    if (showPartNumbers != null) settings.showPartNumbers = showPartNumbers;

    const distanceUnit = localStorage.getItem(settingsStorageKeys.distanceUnit);
    if (distanceUnit != null) settings.distanceUnit = distanceUnit;

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
    async getSettings() {
      return getSettings();
    },
    async setSettings(changes) {
      Object.entries(changes).forEach(([key, value]) => {
        const localStorageKey =
          settingsStorageKeys[key as keyof AccountSettings];
        if (!localStorageKey) return;

        localStorage.setItem(localStorageKey, String(value));
      });
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
