import { getConfig } from './config';
import { DefaultScenario } from './default-scenario';
import { Mock, RequestBody, RequestQuery } from './mock';

export class JsonParser {
  parse(filename: string) {
    const fileContent = require(getConfig().dir + '/' + filename);
    const mocks: Mock[] = Array.isArray(fileContent) ? fileContent : [ fileContent ];

    for (const mock of mocks) {
      const { request } = mock;

      request.body = typeof request.body === 'object' ? this.parseBody(request.body) : request.body;
      request.query = typeof request.query === 'object' ? this.parseQuery(request.query) : request.query;
    }

    return new DefaultScenario(mocks);
  }

  parseBody(body: any): RequestBody {
    const parsed: RequestBody = {};
    const keys = Object.keys(body);

    for (const key of keys) {
      let value = body[key];
      if (Array.isArray(value)) {
        // TODO handle regexes in arrays
      } else if (typeof value === 'object') {
        value = this.parseBody(value);
      } else {
        value = this.parseRegex(value);
      }

      parsed[key] = value;
    }

    return parsed;
  }

  parseQuery(query: any) {
    const parsed: RequestQuery = {};
    const keys = Object.keys(query);

    for (const key of keys) {
      parsed[key] = this.parseRegex(query[key]);
    }

    return parsed;
  }

  parseRegex(input: string) {
    const result = /^\/(.*)\/(\w)$/g.exec(input);
    if (!!result) {
      return new RegExp(result[1], result[2]);
    }
    return input;
  }
}
