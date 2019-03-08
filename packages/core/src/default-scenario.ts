import { Request, Response } from './backend';
import { Mock, MockMatch } from './mock';
import { Scenario } from './scenario';

export class DefaultScenario implements Scenario {
  constructor(public mocks: Mock[]) { }

  next(request: Request, response: Response, match: MockMatch): MockMatch {
    return match;
  }
}
