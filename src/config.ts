import { RequestHandler } from 'express';

export interface PistoletConfig {
  dir?: string;
  port?: number;
  middlewares?: RequestHandler[];
}

let currentConfig: PistoletConfig = {};

export const getConfig = () => {
  return currentConfig;
};

export const setConfig = (value: PistoletConfig) => {
  currentConfig = Object.assign({ port: 8080 }, currentConfig, value);
};
