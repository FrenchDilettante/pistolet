import { Request } from './backend';
import bodyEqual from './body-equal';
import { Mock } from './mock';
import { queryEqual } from './query-equal';

export class RequestMatcher {
  bodyMatches(mock: any, request: any) {
    if (mock === undefined) {
      return true;
    }

    return bodyEqual(mock, request);
  }

  findMatch(request: Request, mocks: Mock[]): Mock {
    for (const mock of mocks) {
      if (this.matches(request, mock)) {
        return mock;
      }
    }
    return undefined;
  }

  matches(request: Request, mock: Mock): boolean {
    if (mock.request.method && request.method !== mock.request.method.toUpperCase()) {
      return false;
    }

    if (!!mock.request.url) {
      if (request.url !== mock.request.url) {
        return false;
      }
      return this.bodyMatches(mock.request.body, request.body);
    } else {
      if (!!mock.request.path && request.path !== mock.request.path) {
        return false;
      }

      if (!!request.query) {
        return queryEqual(mock.request.query, request.query);
      }

      return this.bodyMatches(mock.request.body, request.body);
    }
  }
}
