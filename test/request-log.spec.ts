import { Request, RequestHandler } from 'express';
import { RequestLog } from '../src/request-log';

describe('RequestLog', () => {
  let log: RequestLog;

  beforeEach(() => {
    log = new RequestLog();
  });

  describe('middleware()', () => {
    let middleware: RequestHandler;

    beforeEach(() => middleware = log.middleware());

    it('should create an Express middleware', () => {
      expect(typeof middleware).toEqual('function');
    });

    it('should log the entries', () => {
      const next = jest.fn();
      middleware({ method: 'GET', path: '/entry' } as Request, null, next);
    });
  });
});
