import { DefaultScenario } from './default-scenario';
const basicMock = require('./examples/sample-request');
const delayedMock = require('./examples/delayed-response');

describe('DefaultScenario', () => {
  it('should return the first mock matched', () => {
    const scenario = new DefaultScenario([basicMock]);
    expect(scenario.next(undefined, undefined, basicMock)).toBe(basicMock);
  });

  it('should delay a request', async () => {
    const scenario = new DefaultScenario([delayedMock]);
    const response = scenario.next(undefined, undefined, delayedMock);
    expect(response instanceof Promise).toBe(true);
    expect(await response).toBe(delayedMock);
  });
});
