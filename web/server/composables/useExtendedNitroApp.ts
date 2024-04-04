import type { NitroApp } from 'nitropack';
import type { OnshapeApiClient } from '@aklinker1/cutlist/onshape';

export default function () {
  return useNitroApp() as ExtendedNitroApp;
}

export interface ExtendedNitroApp extends NitroApp {
  onshape: OnshapeApiClient;
}
