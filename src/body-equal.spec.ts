import bodyEqual from './body-equal';

describe('bodyEqual()', () => {
  it('should compare numbers and strings', () => {
    expect(bodyEqual(1, 1)).toBe(true);
    expect(bodyEqual(1, 2)).toBe(false);
    expect(bodyEqual('1', '1')).toBe(true);
    expect(bodyEqual('1', '2')).toBe(false);
  });
});
