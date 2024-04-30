import YAML from 'js-yaml';
import type { Project } from '../projects';
import type { StockMatrix } from '@aklinker1/cutlist';

export interface AccountService {
  id: string;
  getSettings(projectId: string | undefined): Promise<AccountSettings>;
  setSettings(
    projectId: string | undefined,
    changes: Partial<AccountSettings>,
  ): Promise<void>;
  deleteSettings(projectId: string | undefined): Promise<void>;
  listProjects(): Promise<Project[]>;
  saveProject(newProject: Project): Promise<void>;
  removeProject(id: string): Promise<void>;
}

export interface AccountSettings {
  bladeWidth: number;
  distanceUnit: 'in' | 'm' | 'mm';
  extraSpace: number;
  optimize: 'Cuts' | 'Space';
  showPartNumbers: boolean;
  stock: string;
}

const DEFAULT_STOCK: StockMatrix[] = [
  {
    material: 'Oak, Red',
    length: ['3ft', '4ft', '6ft', '8ft'],
    thickness: ['0.5in', '0.75in', '1in'],
    width: ['1.5in', '2.5in', '3.5in', '5.5in', '7.5in'],
  },
  {
    material: 'Plywood',
    width: ['4ft'],
    length: ['8ft'],
    thickness: ['0.25in', '0.5in', '0.75in'],
  },
];

export const DEFAULT_SETTINGS: AccountSettings = {
  bladeWidth: 0.125,
  distanceUnit: 'in',
  extraSpace: 0,
  optimize: 'Cuts',
  showPartNumbers: true,
  stock: YAML.dump(DEFAULT_STOCK, { indent: 2, flowLevel: 2 }),
};
