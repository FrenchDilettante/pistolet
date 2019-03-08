import { RequestHandler } from 'express';
import { PistoletConfig } from 'pistolet';

export interface ExpressPistoletConfig extends PistoletConfig {
  port: number;
  middlewares?: RequestHandler[];
}
