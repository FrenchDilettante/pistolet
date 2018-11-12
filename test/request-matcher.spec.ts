import { Request } from 'express';
import { RequestMatcher } from '../src/request-matcher';
const basicRequest = require('./samples/basic');

describe('RequestMatcher', () => {
  let matcher: RequestMatcher;
  beforeEach(() => {
    matcher = new RequestMatcher();
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

    it('should return undefined if no mock matches the request', () => {
      const request = partialRequest({ url: '/api/different/endpoint', method: 'POST' });
      expect(matcher.findMatch(request, [ basicRequest ])).toBeUndefined();
    });
  });
});
