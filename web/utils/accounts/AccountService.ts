import type { Project } from '../projects';

export interface AccountService {
  id: string;
  getSettings(): Promise<AccountSettings>;
  setSettings(changes: Partial<AccountSettings>): Promise<void>;
  listProjects(): Promise<Project[]>;
  saveProject(newProject: Project): Promise<void>;
  removeProject(id: string): Promise<void>;
}

export interface AccountSettings {
  bladeWidth: number;
  distanceUnit: string;
  extraSpace: number;
  optimize: 'Cuts' | 'Space';
  showPartNumbers: boolean;
}

export const DEFAULT_SETTINGS: AccountSettings = {
  bladeWidth: 0.125,
  distanceUnit: 'in',
  extraSpace: 0,
  optimize: 'Cuts',
  showPartNumbers: true,
};
