export interface PistoletConfig {
  dir?: string;
}

let currentConfig: PistoletConfig = {};

export const getConfig = () => {
  return currentConfig;
};

export const setConfig = (value: PistoletConfig) => {
  currentConfig = value;
};
