import { Request, Response } from './backend';

import { getConfig } from './config';
import { DefaultScenario } from './default-scenario';
import { Mock, RequestBody } from './mock';
import { RequestMatcher } from './request-matcher';
import { Scenario } from './scenario';

export type ResolvableType = Scenario | Mock | string;

export class Pistolet {
  /** @internal */
  debug = require('debug')('pistolet');
  /** @internal */
  missing = this.debug.extend('missing');

  /** @internal */
  backend = new (getConfig().backend)();
  /** @internal */
  matcher = new RequestMatcher();
  /** @internal */
  overrides = new Array<Scenario>();
  /** @internal */
  scenarios = new Array<Scenario>();

  constructor(items: ResolvableType[]) {
    this.scenarios = this.loadScenarios(items);

    this.backend.init(getConfig());
    this.backend.start();
    this.backend.on('request', (request, response) => this.onRequest(request, response));
  }

  /** @internal */
  loadScenarioFile(path: string): Scenario {
    const fileContent = require(getConfig().dir + '/' + path);
    const mocks: Mock[] = Array.isArray(fileContent) ? fileContent : [ fileContent ];
    const regexPattern = /^\/(.*)\/(\w)$/g;

    for (const mock of mocks) {
      if (typeof mock.request.body !== 'object') {
        continue;
      }

      Object.keys(mock.request.body).forEach((key) => {
        let value: string | RegExp = mock.request.body[key] as string;
        const result = regexPattern.exec(value);
        if (!!result) {
          value = new RegExp(result[1], result[2]);
        }
        mock.request.body[key] = value;
      });
    }

    return new DefaultScenario(mocks);
  }

  /** @internal */
  loadScenarios(items: ResolvableType[]) {
    const resolved = new Array<Scenario>();
    const mocks: Mock[] = [];
    for (const item of items) {
      if (typeof item === 'string') {
        resolved.push(this.loadScenarioFile(item));
      } else if ('next' in item) {
        resolved.push(item);
      } else {
        mocks.push(item);
      }
    }
    if (mocks.length > 0) {
      resolved.push(new DefaultScenario(mocks));
    }
    return resolved;
  }

  /** @internal */
  onRequest(request: Request, response: Response) {
    // this.debug('Received %s %s', request.method, request.url);
    const scenarios = this.overrides.concat(this.scenarios);
    for (const scenario of scenarios) {
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
      this.debug('Match for %s %s: %d %j', request.method, request.url, status, result.response.data);
      response.status(status);
      response.send(result.response.data);
      return;
    }

    response.status(404);
    response.send({ errorMessage: 'not found' });
    this.missing('Missing scenario for %s %s', request.method, request.url);
    if (!!request.body) {
      this.missing('%j', request.body);
    }
  }

  /**
   * Adds one or multiple scenario(s) to the front of the matching queue.
   *
   * These additional scenarios will be discarded after calling reset().
   */
  override(...items: ResolvableType[]) {
    this.overrides = this.loadScenarios(items).concat(this.overrides);
  }

  requestsMade() {
    return this.backend.requestsMade();
  }

  reset() {
    this.backend.reset();
    this.overrides = [];
    this.scenarios.forEach((s) => s.reset && s.reset());
  }

  stop() {
    this.scenarios.forEach((s) => s.stop && s.stop());
    this.backend.stop();
  }
}
