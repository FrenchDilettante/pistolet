import { Request, Response } from 'express';
import { Mock } from './mock';
import { Scenario } from './scenario';

export class DefaultScenario implements Scenario {
  constructor(public mocks: Mock[]) { }

  next(request: Request, response: Response, matches: Mock[]) {
    return matches[0];
  }
}
