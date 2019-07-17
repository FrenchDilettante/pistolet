import { getConfig, setConfig } from './config';
import { DefaultScenario } from './default-scenario';
import { Pistolet } from './pistolet';
import { Scenario } from './scenario';
import { TestBackend } from './test-backend';

describe('Pistolet', () => {
  let pistolet: Pistolet;
  let spyScenario: Scenario;

  const sampleScenario = {
    request: { method: 'GET', path: '/request' },
    response: { data: 'hello world' },
  };

  beforeAll(() => {
    setConfig({
      backend: TestBackend,
      dir: __dirname,
    });
  });

  beforeEach(() => {
    spyScenario = {
      mocks: [],
      next: (req, res, match) => match,
      reset: () => void 0,
    };
    spyOn(spyScenario, 'next');
    spyOn(spyScenario, 'reset');

    pistolet = new Pistolet([]);
  });

  afterEach(() => pistolet.stop());

  it('should instantiate', () => {
    expect(pistolet).toBeDefined();
  });

  describe('loadScenarios', () => {
    it('should accept a string, and load the JSON file associated', () => {
      const scenarios = pistolet.loadScenarios(['examples/sample-request']);
      expect(scenarios.length).toBe(1);
      expect(scenarios[0].mocks[0].name).toEqual('A basic request');
    });

    it('should accept an object implementing the Scenario interface', () => {
      const scenarios = pistolet.loadScenarios([new DefaultScenario([ sampleScenario ])]);

      expect(scenarios.length).toBe(1);
      expect(scenarios[0].mocks[0].request.path).toEqual('/request');
    });

    it('should accept a basic Javascript object', () => {
      const scenarios = pistolet.loadScenarios([ sampleScenario ]);
      expect(scenarios.length).toBe(1);
      expect(scenarios[0].mocks[0].request.path).toEqual('/request');
    });

    it('should gracefully fail when a single scenario is missing', () => {
      expect(() => {
        const scenarios = pistolet.loadScenarios(['examples/sample-request', 'non-existent']);
        expect(scenarios.length).toBe(1);
        expect(scenarios[0].mocks[0].name).toEqual('A basic request');
      }).not.toThrow();
    });
  });

  describe('onRequest()', () => {
    beforeEach(() => {
      pistolet.override(spyScenario, 'examples/sample-request');
      (spyScenario.next as jasmine.Spy).calls.reset();
    });

    it('returns the first mock matching the request', async () => {
      const response = await TestBackend.request({
        method: 'GET',
        url: '/api/endpoint',
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual('Hello, World!');

      expect(spyScenario.next).not.toHaveBeenCalled();
    });

    it('should wait for an async mock', async () => {
      pistolet.override(spyScenario, 'examples/delayed-response');
      const response = await TestBackend.request({
        method: 'GET',
        url: '/api/endpoint',
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual('Hello, (pause), World!');
    });

    describe('Not found', () => {
      it('returns 404 if not mock is found', async () => {
        const error = await TestBackend.request({
          method: 'POST',
          url: '/api/endpoint',
        });
        expect(error.statusCode).toBe(404);
        expect(error.body).toEqual({ errorMessage: 'not found' });
      });

      it('should allow to configure the 404 message', async () => {
        getConfig().notFoundResponse = { status: 404, data: { custom: 'error message' } };

        const error = await TestBackend.request({
          method: 'POST',
          url: '/api/endpoint',
        });
        expect(error.statusCode).toBe(404);
        expect(error.body).toEqual({ custom: 'error message' });
      });
    });
  });

  describe('override()', () => {
    it('should place a new scenario at the front of the queue', async () => {
      pistolet.scenarios = pistolet.loadScenarios(['examples/sample-request']);
      pistolet.override({
        request: { method: 'GET', path: '/api/endpoint' },
        response: { data: 'this is an override' },
      });

      const response = await TestBackend.request({
        method: 'GET',
        url: '/api/endpoint',
      });
      expect(response).toEqual({ body: 'this is an override', statusCode: 200 });
    });
  });

  describe('requestsMade()', () => {
    it('should return the entries made', async () => {
      pistolet.override('examples/sample-request');

      await TestBackend.request({ method: 'GET', url: '/api/endpoint' });
      expect(pistolet.requestsMade()).toEqual([
        { method: 'GET', path: '/api/endpoint' },
      ]);
      expect(pistolet.lastRequest()).toEqual({ method: 'GET', path: '/api/endpoint' });
    });
  });

  describe('reset()', () => {
    it('should reset all scenarios', () => {
      pistolet.scenarios = pistolet.loadScenarios([spyScenario]);
      pistolet.reset();
      expect(spyScenario.reset).toHaveBeenCalled();
    });

    it('should discard overrides', () => {
      pistolet.override(sampleScenario);
      pistolet.reset();
      expect(pistolet.overrides.length).toBe(0);
    });
  });
});
