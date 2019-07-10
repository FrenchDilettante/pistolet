import { DefaultScenario } from './default-scenario';
const basicMock = require('./examples/sample-request');

describe('DefaultScenario', () => {
  it('should return the first mock matched', () => {
    const scenario = new DefaultScenario([basicMock]);
    expect(scenario.next(undefined, undefined, basicMock)).toBe(basicMock);
  });
});
