import { Request, Response } from './backend';

import { getConfig } from './config';
import { DefaultScenario } from './default-scenario';
import { JsonParser } from './json-parser';
import { Mock } from './mock';
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
  parser = new JsonParser();
  /** @internal */
  scenarios = new Array<Scenario>();

  constructor(items: ResolvableType[]) {
    this.scenarios = this.loadScenarios(items);

    this.backend.init(getConfig());
    this.backend.start();
    this.backend.on('request', (request, response) => this.onRequest(request, response));
  }

  lastRequest() {
    const requests = this.requestsMade();
    return requests[requests.length - 1];
  }

  /** @internal */
  loadScenarios(items: ResolvableType[]) {
    const resolved = new Array<Scenario>();
    const mocks: Mock[] = [];
    for (const item of items) {
      try {
        if (typeof item === 'string') {
          resolved.push(this.parser.parse(item));
        } else if ('next' in item) {
          resolved.push(item);
        } else {
          mocks.push(item);
        }
      } catch (e) {
        // It's a feature, not a bug!
        // tslint:disable-next-line:no-console
        console.error(e);
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
      this.debug('Match for %s %s: %d %j', request.method, request.path, status, result.response.data);
      response.status(status);
      response.send(result.response.data);
      return;
    }

    response.status(404);
    response.send({ errorMessage: 'not found' });
    this.missing('Missing scenario for %s %s %j', request.method, request.url, request.body);
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
