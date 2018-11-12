import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { Server } from 'http';

import { DefaultScenario } from './default-scenario';
import { Mock } from './mock';
import { RequestMatcher } from './request-matcher';
import { Scenario } from './scenario';

export class Pistolet {
  app: express.Application;
  matcher = new RequestMatcher();
  port = 8081;
  scenarios: Scenario[] = [];
  server: Server;

  constructor(items: Array<Scenario | Mock>) {
    this.loadScenarios(items);

    this.app = this.createServer();
    this.server = this.startServer();
    this.app.all('*', (request, response) => this.onRequest(request, response));
  }

  createServer() {
    const app = express();
    app.use(cors({
      credentials: true,
      origin: (origin, callback) => callback(null, true),
    }));
    app.use(bodyParser.json());
    return app;
  }

  loadScenarios(items: Array<Scenario | Mock>) {
    const mocks: Mock[] = [];
    for (const item of items) {
      if ('next' in item) {
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
    console.debug(`"${request.method} ${request.url}"`);
    for (const scenario of this.scenarios) {
      const match = this.matcher.findMatch(request, scenario.mocks);
      const result = scenario.next(request, response, match);
      if (result === true) {
        return;
      }
      if (result === false || result === undefined) {
        continue;
      }

      response.statusCode = result.response.status || 200;
      response.send(result.response.data);
      return;
    }

    response.statusCode = 404;
    response.send('not found');
  }

  reset() {
    this.scenarios.forEach((s) => s.reset && s.reset());
  }

  startServer() {
    return this.app.listen(this.port, () => console.log(`Pistolet running on port ${this.port}`));
  }

  stop() {
    console.log('Stopping Pistolet server');
    this.scenarios.forEach((s) => s.stop && s.stop());
    this.server.close();
  }
}
