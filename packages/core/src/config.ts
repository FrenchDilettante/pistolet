import { Backend } from './backend';

interface BackendConstructor {
  new (): Backend;
}

export interface PistoletConfig {
  backend: BackendConstructor;
  dir: string;
  [key: string]: any;
}

let currentConfig: PistoletConfig;

export function getConfig() {
  if (currentConfig === undefined) {
    currentConfig = { backend: undefined, dir: '' };
  }
  return currentConfig;
}

export function setConfig(value: PistoletConfig) {
  currentConfig = value;
}
