import cors from 'cors';
import express, { Express, json, Request, RequestHandler, Response } from 'express';
import { Server } from 'http';
import { join } from 'path';

import { getConfig } from './config';
import { DefaultScenario } from './default-scenario';
import { Mock } from './mock';
import { RequestLog } from './request-log';
import { RequestMatcher } from './request-matcher';
import { Scenario } from './scenario';

export type ResolvableType = Scenario | Mock | string;

export class Pistolet {
  app: express.Application;
  matcher = new RequestMatcher();
  log = new RequestLog();
  port = getConfig().port;
  scenarios: Scenario[] = [];
  server: Server;

  constructor(items: ResolvableType[]) {
    this.loadScenarios(items);

    this.app = this.createServer();
    this.server = this.startServer();
    this.app.all('*', (request, response) => this.onRequest(request, response));
  }

  createServer(): Express {
    const app = express();
    app.use(cors({
      credentials: true,
      origin: (origin, callback) => callback(null, true),
    }));
    app.use(json());
    app.use(this.log.middleware());
    (getConfig().middlewares || []).forEach((middleware) => app.use(middleware));
    return app;
  }

  loadScenarioFile(path: string): Scenario {
    const fileContent = require(join(getConfig().dir, path));
    const mocks: Mock[] = Array.isArray(fileContent) ? fileContent : [ fileContent ];
    return new DefaultScenario(mocks);
  }

  loadScenarios(items: ResolvableType[]) {
    const mocks: Mock[] = [];
    for (const item of items) {
      if (typeof item === 'string') {
        this.scenarios.push(this.loadScenarioFile(item));
      } else if ('next' in item) {
        this.scenarios.push(item);
      } else {
        mocks.push(item);
      }
    }
    if (mocks.length > 0) {
      this.scenarios.push(new DefaultScenario(mocks));
    }
  }

  onRequest(request: Request, response: Response) {
    for (const scenario of this.scenarios) {
      const match = this.matcher.findMatch(request, scenario.mocks);
      if (!match) {
        continue;
      }

      const result = scenario.next(request, response, match);
      if (result === true) {
        return;
      }
      if (result === false || result === undefined) {
        continue;
      }

      response.status(result.response.status || 200);
      response.send(result.response.data);
      return;
    }

    response.status(404);
    response.send('not found');
  }

  requestsMade() {
    return this.log.entries;
  }

  reset() {
    this.log.clear();
    this.scenarios.forEach((s) => s.reset && s.reset());
  }

  startServer() {
    return this.app.listen(this.port);
  }

  stop() {
    this.scenarios.forEach((s) => s.stop && s.stop());
    this.server.close();
  }
}
