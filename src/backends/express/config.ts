import { RequestHandler } from 'express';
import { PistoletConfig } from '../../config';

export interface ExpressPistoletConfig extends PistoletConfig {
  port: number;
  middlewares?: RequestHandler[];
}
