import { DefaultScenario } from '../src/default-scenario';
const basicMock = require('./samples/basic');

describe('DefaultScenario', () => {
  it('should return the first mock matched', () => {
    const scenario = new DefaultScenario([basicMock]);
    expect(scenario.next(undefined, undefined, basicMock)).toBe(basicMock);
  });
});
