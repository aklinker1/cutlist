import type { NitroApp } from 'nitropack';
import type { OnshapeLoader } from '@aklinker1/cutlist/onshape';

export default function () {
  return useNitroApp() as ExtendedNitroApp;
}

export interface ExtendedNitroApp extends NitroApp {
  onshape: OnshapeLoader;
}
