import { Request } from './backend';
import bodyEqual from './body-equal';
import { Mock } from './mock';

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
    if (request.path !== mock.request.path) {
      return false;
    }

    if (mock.request.method && request.method !== mock.request.method.toUpperCase()) {
      return false;
    }

    if (!!request.query) {
      return bodyEqual(mock.request.query, request.query);
    }

    if (mock.request.body === undefined) {
      return true;
    }

    return bodyEqual(mock.request.body, request.body);
  }
}
