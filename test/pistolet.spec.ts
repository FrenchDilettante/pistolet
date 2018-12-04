import { Request, Response } from 'express';
import { setConfig } from '../src/config';
import { DefaultScenario } from '../src/default-scenario';
import { Pistolet } from '../src/pistolet';
import { Scenario } from '../src/scenario';

describe('Pistolet', () => {
  let pistolet: Pistolet;
  let spyResponse: Response;
  let spyScenario: Scenario;

  beforeEach(() => {
    spyScenario = {
      mocks: [],
      next: (req, res, match) => match,
      reset: () => void 0,
    };
    spyOn(spyScenario, 'next');
    spyOn(spyScenario, 'reset');

    spyResponse = {
      send: () => void 0,
    } as Response;
    spyOn(spyResponse, 'send');

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

    it('returns the first mock matching the request', () => {
      const request = {
        method: 'GET',
        url: '/api/endpoint',
      } as Request;
      pistolet.onRequest(request, spyResponse);

      expect(spyResponse.statusCode).toBe(200);
      expect(spyResponse.send).toHaveBeenCalledWith('Hello, World!');

      expect(spyScenario.next).not.toHaveBeenCalled();
    });

    it('returns 404 if not mock is found', () => {
      const request = {
        method: 'GET',
        url: '/not/an/api/endpoint',
      } as Request;
      pistolet.onRequest(request, spyResponse);

      expect(spyResponse.statusCode).toBe(404);
      expect(spyResponse.send).toHaveBeenCalledWith('not found');
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
