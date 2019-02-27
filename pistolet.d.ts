declare module 'pistolet' {
  interface Backend {
    init(config: PistoletConfig): void;
    on(event: 'request', listener: (request: Request, response: Response) => void): void;
    requestsMade(): RequestEntry[];
    reset(): void;
    start(): void;
    stop(): void;
  }

  interface BackendConstructor {
    new (): Backend;
  }

  interface Mock {
    name?: string;
    request: RequestMock;
    response: ResponseMock;
  }

  interface PistoletConfig {
    backend: BackendConstructor;
    dir: string;
    [key: string]: any;
  }

  interface Request {
    body: any;
    method: string;
    url: string;
  }

  interface RequestEntry {
    method: string;
    path: string;
  }

  interface Response {
    send(body: any): Response;
    status(code: number): Response;
  }

  interface RequestMock {
    path: string;
    method: string;
    body?: object | string;
  }

  interface ResponseMock {
    data: object | string;
    status?: number;
  }

  interface Scenario {
    mocks: Mock[];
    next(request: Request, response: Response, match: Mock): MockMatch;
    reset?(): void;
    stop?(): void;
  }

  type MockMatch = Mock | boolean | undefined;

  type ResolvableType = Scenario | Mock | string;

  export function getConfig(): PistoletConfig;

  export function setConfig(value: PistoletConfig): void;

  export class Pistolet {
    constructor(items: ResolvableType[]);
    requestsMade(): RequestEntry[];
    reset(): void;
    stop(): void;
  }
}

declare module 'pistolet/backends/express' {
  import { EventEmitter } from 'events';
  import { RequestHandler } from 'express';
  import { Backend, PistoletConfig, RequestEntry } from 'pistolet';

  export interface ExpressPistoletConfig extends PistoletConfig {
    port: number;
    middlewares?: RequestHandler[];
  }

  export class ExpressBackend extends EventEmitter implements Backend {
    init(config: ExpressPistoletConfig): void;
    logMiddleware(): RequestHandler;
    requestsMade(): RequestEntry[];
    reset(): void;
    start(): void;
    stop(): void;
  }
}
