import { Request, Response } from 'express';
import { Mock, MockMatch, Scenario } from 'pistolet';

export class HelloWorldScenario implements Scenario {
  mocks: Mock[] = [{
    name: 'hello-world',
    request: {
      method: 'POST',
      path: '/hello',
    },
    response: {
      data: { },
    },
  }];

  next(request: Request, response: Response, match: Mock): MockMatch {
    match.response.data = { message: `Hello ${request.body.name}!` };
    return match;
  }
}
