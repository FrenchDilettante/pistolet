import { setConfig } from '../src/config';
import { DefaultScenario } from '../src/default-scenario';
import { Pistolet } from '../src/pistolet';

describe('Pistolet', () => {
  let pistolet: Pistolet;

  beforeEach(() => {
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
});
