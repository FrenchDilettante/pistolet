import { setConfig } from './config';
import { DefaultScenario } from './default-scenario';
import { Pistolet } from './pistolet';
import { Scenario } from './scenario';
import { TestBackend } from './test-backend';

describe('Pistolet', () => {
  let pistolet: Pistolet;
  let spyScenario: Scenario;

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

  describe('loadScenarioFile()', () => {
    it('should load a singe mock from a json file', () => {
      const scenario = pistolet.loadScenarioFile('sample-request');
      expect(scenario).toBeDefined();
      expect(scenario instanceof DefaultScenario).toBe(true);
      expect(scenario.mocks[0].request).toEqual({ method: 'GET', path: '/api/endpoint' });
    });
  });

  describe('onRequest()', () => {
    beforeEach(() => {
      pistolet.loadScenarios([spyScenario, 'sample-request']);
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

    it('returns 404 if not mock is found', async () => {
      const error = await TestBackend.request({
        method: 'POST',
        url: '/api/endpoint',
      });

      expect(error.statusCode).toBe(404);
      expect(error.body).toEqual({ errorMessage: 'not found' });
    });
  });

  describe('requestsMade()', () => {
    it('should return the entries made', async () => {
      pistolet.loadScenarios(['sample-request']);
      await TestBackend.request({ method: 'GET', url: '/api/endpoint' });
      expect(pistolet.requestsMade()).toEqual([
        { method: 'GET', path: '/api/endpoint' },
      ]);
    });
  });

  describe('reset()', () => {
    it('should reset all scenarios', () => {
      pistolet.loadScenarios([spyScenario]);
      pistolet.reset();
      expect(spyScenario.reset).toHaveBeenCalled();
    });
  });
});
