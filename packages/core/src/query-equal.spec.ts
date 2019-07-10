import { queryEqual } from './query-equal';

describe('queryEqual()', () => {
  it('should match basic objects', () => {
    expect(queryEqual({ q: 'query' }, { q: 'query' })).toBe(true);
    expect(queryEqual({ q: 'query' }, { q: 'nope' })).toBe(false);
  });

  it('should match regular expressions', () => {
    expect(queryEqual({ startDate: /^\d{4}-\d{2}-\d{2}$/g }, { startDate: '2010-01-01' })).toBe(true);
    expect(queryEqual({ startDate: /^\d{4}-\d{2}-\d{2}$/g }, { startDate: 'nope' })).toBe(false);
  });

  it('should match a mixture of both', () => {
    expect(queryEqual(
      { startDate: /^\d{4}-\d{2}-\d{2}$/g, q: 'query' },
      { startDate: '2010-01-01', q: 'query' },
    )).toBe(true);

    expect(queryEqual(
      { startDate: /^\d{4}-\d{2}-\d{2}$/g, q: 'query' },
      { startDate: '2010-01-01' },
    )).toBe(false);

    expect(queryEqual(
      { startDate: /^\d{4}-\d{2}-\d{2}$/g, q: 'query' },
      { endDate: '2010-01-01', q: 'query' },
    )).toBe(false);
  });

  it('should let the default Express query pass', () => {
    expect(queryEqual(undefined, {})).toBe(true);
  });

  it('should reject unexpected query parameters', () => {
    expect(queryEqual(null, { q: 'query' })).toBe(false);
  });
});
