import { Request } from 'express';
import bodyEqual from './body-equal';
import { Mock, MockMatch } from './mock';

export class RequestMatcher {
  findMatch(request: Request, mocks: Mock[]): Mock {
    for (const mock of mocks) {
      if (this.matches(request, mock)) {
        return mock;
      }
    }
    return undefined;
  }

  matches(request: Request, mock: Mock): boolean {
    if (request.url !== mock.request.path) {
      return false;
    }

    if (request.method !== mock.request.method) {
      return false;
    }

    if (mock.request.body === undefined) {
      return true;
    }

    return bodyEqual(mock.request.body, request.body);
  }
}
