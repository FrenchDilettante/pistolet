import bodyEqual from '../src/body-equal';

describe('bodyEqual()', () => {
  it('should compare numbers and strings', () => {
    expect(bodyEqual(1, 1)).toBe(true);
    expect(bodyEqual(1, 2)).toBe(false);
    expect(bodyEqual('1', '1')).toBe(true);
    expect(bodyEqual('1', '2')).toBe(false);
  });

  it('should compare arrays', () => {
    expect(bodyEqual([1, 2, 'a'], [1, 2, 'a'])).toBe(true);
    expect(bodyEqual([1, 2, 'a'], [1, 2, 'b'])).toBe(false);
    expect(bodyEqual([1, 2, 'a'], [])).toBe(false);
  });

  it('should compare objects', () => {
    expect(bodyEqual({ a: '1' }, { b: '2' })).toBe(false);
    expect(bodyEqual({ a: '1' }, { a: '1' })).toBe(true);
  });

  it('should accept regexes in parts of the mock', () => {
    const mock = { id: /^\d+$/g };
    expect(bodyEqual(mock, { id: 123 })).toBe(true);
    expect(bodyEqual(mock, { id: '1a' })).toBe(false);
  });

  it('should run null checks', () => {
    expect(bodyEqual({}, null)).toBe(false);
    expect(bodyEqual(null, {})).toBe(false);
  });
});
