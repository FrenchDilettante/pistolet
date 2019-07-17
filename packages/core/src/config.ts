import { Backend } from './backend';
import { ResponseMock } from './mock';

type BackendConstructor = new () => Backend;

export interface PistoletConfig {
  backend: BackendConstructor;
  dir: string;
  notFoundResponse?: ResponseMock;
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
