import { Request, Response } from 'pistolet/src';
import rp from 'request-promise-native';
import { ExpressPistoletConfig } from './config';
import { ExpressBackend } from './express-backend';

describe('ExpressBackend', () => {
  let backend: ExpressBackend;

  beforeEach(() => {
    backend = new ExpressBackend();
    backend.init({ port: 8080 } as ExpressPistoletConfig);
    backend.start();
  });

  afterEach(() => backend.stop());

  it('should initialize', () => {
    expect(backend).toBeDefined();
  });

  describe('middleware', () => {
    it('should pass a request to the proper format', (done) => {
      backend.on('request', (request: Request, response: Response) => {
        response.send('ok');

        expect(request.method).toBe('GET');
        expect(request.path).toBe('/query');
        expect(request.url).toBe('/query');

        expect(typeof response.status).toBe('function');
        expect(typeof response.send).toBe('function');

        done();
      });
      rp('http://localhost:8080/query');
    });

    it('should parse the query parameters', (done) => {
      backend.on('request', (request: Request, response: Response) => {
        response.send('ok');

        expect(request.path).toBe('/query');
        expect(request.query).toEqual({ q: 'criteria' });
        expect(request.url).toBe('/query?q=criteria');
        done();
      });
      rp('http://localhost:8080/query?q=criteria');
    });

    it('should parse the body', (done) => {
      backend.on('request', (request: Request, response: Response) => {
        response.send('ok');

        expect(request.method).toBe('POST');
        expect(request.path).toBe('/query');
        expect(request.body).toEqual({ this: 'is json' });
        done();
      });
      rp('http://localhost:8080/query', {
        body: '{ "this": "is json" }',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
    });
  });
});
