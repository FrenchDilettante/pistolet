import request from 'request-promise';
import { setConfig } from './config';
import { DefaultScenario } from './default-scenario';
import { Pistolet } from './pistolet';
import { Scenario } from './scenario';

describe('Pistolet', () => {
  let pistolet: Pistolet;
  let spyScenario: Scenario;

  beforeEach(() => {
    spyScenario = {
      mocks: [],
      next: (req, res, match) => match,
      reset: () => void 0,
    };
    spyOn(spyScenario, 'next');
    spyOn(spyScenario, 'reset');

    setConfig({
      dir: `${__dirname}/samples`,
    });
    pistolet = new Pistolet([]);
  });

  afterEach(() => pistolet.stop());

  it('should instantiate', () => {
    expect(pistolet).toBeDefined();
  });

  describe('loadScenarioFile()', () => {
    it('should load a singe mock from a json file', () => {
      const scenario = pistolet.loadScenarioFile('basic');
      expect(scenario).toBeDefined();
      expect(scenario instanceof DefaultScenario).toBe(true);
      expect(scenario.mocks[0].request).toEqual({ method: 'GET', path: '/api/endpoint' });
    });
  });

  describe('onRequest()', () => {
    beforeEach(() => {
      pistolet.loadScenarios([spyScenario, 'basic']);
      (spyScenario.next as jasmine.Spy).calls.reset();
    });

    it('returns the first mock matching the request', async () => {
      const response = await request({
        method: 'GET',
        resolveWithFullResponse: true,
        url: 'http://localhost:8080/api/endpoint',
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual('Hello, World!');

      expect(spyScenario.next).not.toHaveBeenCalled();
    });

    it('returns 404 if not mock is found', async () => {
      try {
        await request({
          method: 'POST',
          resolveWithFullResponse: true,
          url: 'http://localhost:8080/api/endpoint',
        });
      } catch (error) {
        expect(error.statusCode).toBe(404);
        expect(error.response.body).toEqual('not found');
      }
    });
  });

  describe('requestsMade()', () => {
    it('should return the requests made', async () => {
      pistolet.loadScenarios(['basic']);
      await request({ method: 'GET', url: 'http://localhost:8080/api/endpoint' });
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
