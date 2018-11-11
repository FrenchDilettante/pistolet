import { Pistolet } from '../src/pistolet';

describe('Pistolet', () => {
  let pistolet: Pistolet;

  beforeEach(() => {
    pistolet = new Pistolet([]);
  });

  afterEach(() => pistolet.stop());

  it('should instantiate', () => {
    expect(pistolet).toBeDefined();
  });
});
