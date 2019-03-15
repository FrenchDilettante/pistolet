import { Request, Response } from './backend';

import { getConfig } from './config';
import { DefaultScenario } from './default-scenario';
import { Mock } from './mock';
import { RequestMatcher } from './request-matcher';
import { Scenario } from './scenario';

export type ResolvableType = Scenario | Mock | string;

export class Pistolet {
  debug = require('debug')('pistolet');

  backend = new (getConfig().backend)();
  matcher = new RequestMatcher();
  scenarios: Scenario[] = [];

  constructor(items: ResolvableType[]) {
    this.loadScenarios(items);

    this.backend.init(getConfig());
    this.backend.start();
    this.backend.on('request', (request, response) => this.onRequest(request, response));
  }

  loadScenarioFile(path: string): Scenario {
    const fileContent = require(getConfig().dir + '/' + path);
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
    this.debug('Received %s %s', request.method, request.url);
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

      const status = result.response.status || 200;
      this.debug('Sending %d %j', status, result.response.data);
      response.status(status);
      response.send(result.response.data);
      return;
    }

    response.status(404);
    response.send({ errorMessage: 'not found' });
  }

  requestsMade() {
    return this.backend.requestsMade();
  }

  reset() {
    this.backend.reset();
    this.scenarios.forEach((s) => s.reset && s.reset());
  }

  stop() {
    this.scenarios.forEach((s) => s.stop && s.stop());
    this.backend.stop();
  }
}
