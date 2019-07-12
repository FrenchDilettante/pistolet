import { setConfig } from './config';
import { JsonParser } from './json-parser';
import { TestBackend } from './test-backend';

describe('JsonParser', () => {
  let parser: JsonParser;

  beforeAll(() => {
    setConfig({
      backend: TestBackend,
      dir: __dirname,
    });
  });

  beforeEach(() => parser = new JsonParser());

  describe('parse()', () => {
    it('should load and parse JSON files', () => {
      const scenario = parser.parse('examples/sample-request');
      expect(scenario.mocks[0].name).toBe('A basic request');
    });

    it('should parse regular expressions contained in JSON files', () => {
      const scenario = parser.parse('examples/sample-regex');
      expect(scenario.mocks[0].request.body.startDate).toEqual(/^\d{4}-\d{2}-\d{2}$/g);
      // @ts-ignore the TypeScript recursive key-value interface doesn't seem to work
      expect(scenario.mocks[1].request.body.deep.endDate).toEqual(/^\d{4}-\d{2}-\d{2}$/g);
      expect(scenario.mocks[2].request.query.startDate).toEqual(/^\d{4}-\d{2}-\d{2}$/g);
    });

    it('should throw an exception if the file does not exist', () => {
      expect(() => parser.parse('not-existent'))
        .toThrowError('Could not load "not-existent", file does not exist');
    });
  });

  describe('parseBody()', () => {
    it('should parse regular expressions in a body', () => {
      expect(parser.parseBody({
        q: 'search criteria',
        startDate: '/^\\d{4}-\\d{2}-\\d{2}$/g',
      })).toEqual({
        q: 'search criteria',
        startDate: /^\d{4}-\d{2}-\d{2}$/g,
      });
    });

    it('should parse deep regular expressions in a body', () => {
      expect(parser.parseBody({
        deep: {
          endDate: '/^\\d{4}-\\d{2}-\\d{2}$/g',
        },
        q: 'search criteria',
        startDate: '/^\\d{4}-\\d{2}-\\d{2}$/g',
      })).toEqual({
        deep: {
          endDate: /^\d{4}-\d{2}-\d{2}$/g,
        },
        q: 'search criteria',
        startDate: /^\d{4}-\d{2}-\d{2}$/g,
      });
    });

    it('should leave regular strings as is', () => {
      expect(parser.parseBody({
        q: 'search criteria',
        startDate: 'today',
      })).toEqual({
        q: 'search criteria',
        startDate: 'today',
      });
    });
  });

  describe('parseQuery()', () => {
    it('should parse regular expressions in a query', () => {
      expect(parser.parseQuery({
        q: 'search criteria',
        startDate: '/^\\d{4}-\\d{2}-\\d{2}$/g',
      })).toEqual({
        q: 'search criteria',
        startDate: /^\d{4}-\d{2}-\d{2}$/g,
      });
    });

    it('should leave regular strings as is', () => {
      expect(parser.parseQuery({
        q: 'search criteria',
        startDate: 'today',
      })).toEqual({
        q: 'search criteria',
        startDate: 'today',
      });
    });
  });

  describe('parseRegex()', () => {
    it('should parse a valid regular expression', () => {
      expect(parser.parseRegex('/\\d{4}-\\d{2}-\\d{2}/g')).toEqual(/\d{4}-\d{2}-\d{2}/g);
    });

    it('should not parse strings', () => {
      expect(parser.parseRegex('a string')).toEqual('a string');
    });
  });
});
