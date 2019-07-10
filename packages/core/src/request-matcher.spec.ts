import { readFileSync } from 'fs';
import { Request } from './backend';
import { Mock } from './mock';
import { RequestMatcher } from './request-matcher';

describe('RequestMatcher', () => {
  let matcher: RequestMatcher;
  let basicRequest: Mock;
  beforeEach(() => {
    matcher = new RequestMatcher();
    basicRequest = JSON.parse(readFileSync(__dirname + '/sample-request.json', 'UTF-8'));
  });

  // Typescript trick to allow to pass partial objects as "Request"
  function partialRequest(request: any): Request {
    return request;
  }

  it('should instantiate', () => {
    expect(matcher).toBeDefined();
  });

  describe('findMatch', () => {
    it('should return the first mock matching the request', () => {
      const request = partialRequest({ url: '/api/endpoint', method: 'GET' });
      expect(matcher.findMatch(request, [ basicRequest ])).toBe(basicRequest);
    });

    it('should compare the mock and request bodies', () => {
      const requestWithBody = {
        request: {
          body: { some: 'data' },
          method: 'GET',
          path: '/api/endpoint',
        },
        response: { data: 'Hello, World!' },
      };
      const request = partialRequest({ url: '/api/endpoint', method: 'GET', body: { some: 'data' } });
      expect(matcher.findMatch(request, [ requestWithBody ])).toBe(requestWithBody);
    });

    it('should not be case sensitive for the method', () => {
      const mock: Mock = {
        request: {
          method: 'get',
          path: '/api/endpoint',
        },
        response: { data: { } },
      };
      const request = partialRequest({ url: '/api/endpoint', method: 'GET' });
      expect(matcher.matches(request, mock)).toBe(true);
    });

    it('should allow all requests when the method is not set', () => {
      const mock: Mock = {
        request: {
          path: '/api/endpoint',
        },
        response: { data: { } },
      };
      const request = partialRequest({ url: '/api/endpoint', method: 'GET' });
      expect(matcher.matches(request, mock)).toBe(true);
    });

    it('should return undefined if no mock matches the request', () => {
      const request = partialRequest({ url: '/api/different/endpoint', method: 'POST' });
      expect(matcher.findMatch(request, [ basicRequest ])).toBeUndefined();
    });
  });
});
