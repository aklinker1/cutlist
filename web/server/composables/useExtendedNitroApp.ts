import type { NitroApp } from 'nitropack';
import type { OnshapeApiClient } from '~~/src/onshape';

export default function () {
  return useNitroApp() as ExtendedNitroApp;
}

export interface ExtendedNitroApp extends NitroApp {
  onshape: OnshapeApiClient;
}
