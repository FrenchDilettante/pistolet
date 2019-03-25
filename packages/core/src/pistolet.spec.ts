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

  describe('loadScenarios', () => {
    it('should accept a string, and load the JSON file associated', () => {
      pistolet.loadScenarios(['sample-request']);
      expect(pistolet.scenarios.length).toBe(1);
      expect(pistolet.scenarios[0].mocks[0].name).toEqual('A basic request');
    });

    it('should accept an object implementing the Scenario interface', () => {
      pistolet.loadScenarios([new DefaultScenario([{
        name: 'A scenario class instance',
        request: { method: 'GET', path: '/request' },
        response: { data: 'hello world' },
      }])]);

      expect(pistolet.scenarios.length).toBe(1);
      expect(pistolet.scenarios[0].mocks[0].name).toEqual('A scenario class instance');
    });

    it('should accept a basic Javascript object', () => {
      pistolet.loadScenarios([{
        name: 'A Javascript scenario object',
        request: { method: 'GET', path: '/request' },
        response: { data: 'hello world' },
      }]);
      expect(pistolet.scenarios.length).toBe(1);
      expect(pistolet.scenarios[0].mocks[0].name).toEqual('A Javascript scenario object');
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
