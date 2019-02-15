import { PistoletConfig } from './config';

export interface Backend {
  init(config: PistoletConfig): void;
  on(event: 'request', listener: (request: Request, response: Response) => void): void;
  requestsMade(): RequestEntry[];
  reset(): void;
  start(): void;
  stop(): void;
}

export interface Request {
  body: any;
  method: string;
  url: string;
}

export interface RequestEntry {
  method: string;
  path: string;
}

export interface Response {
  send(body: any): Response;
  status(code: number): Response;
}
