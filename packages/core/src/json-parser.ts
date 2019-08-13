import { existsSync } from 'fs';
import { getConfig } from './config';
import { DefaultScenario } from './default-scenario';
import { Mock, RequestBody, RequestQuery } from './mock';

export class JsonParser {
  parse(filename: string) {
    const fullpath = `${getConfig().dir}/${filename}.json`;
    if (!existsSync(fullpath)) {
      throw new Error(`Could not load "${filename}", file does not exist`);
    }

    const fileContent = require(fullpath);
    const mocks = Array.isArray(fileContent) ? fileContent : [ fileContent ];

    for (const mock of mocks) {
      const { request } = mock;

      request.path = typeof request.path !== 'undefined' ? this.parseRegex(request.path) : request.path;
      request.url = typeof request.url !== 'undefined' ? this.parseRegex(request.url) : request.url;
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
      if (value === undefined || value === null) {
        // do nothing
      } else if (Array.isArray(value)) {
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
    const result = /^\/(.*)\/([g|i|m|s|u|y])$/g.exec(input);
    if (!!result) {
      return new RegExp(result[1], result[2]);
    }
    return input;
  }
}
