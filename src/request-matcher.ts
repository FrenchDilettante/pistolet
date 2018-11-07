import { Request } from 'express';
import bodyEqual from './body-equal';
import { Mock } from './mock';

export class RequestMatcher {
  filter(request: Request, mocks: Mock[]): Mock[] {
    return mocks.filter((mock) => this.matches(request, mock));
  }

  matches(request: Request, mock: Mock): boolean {
    if (request.url !== mock.request.path) {
      return false;
    }

    if (request.method !== mock.request.method) {
      return false;
    }

    if (mock.request.body !== undefined && bodyEqual(mock.request.body, request.body)) {
      return false;
    }

    return true;
  }
}
