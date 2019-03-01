import { EventEmitter } from 'events';
import { Backend, PistoletConfig, Request, RequestEntry, Response } from 'pistolet';

export class AngularBackend extends EventEmitter implements Backend {
  static instance: AngularBackend;

  debug = require('debug')('pistolet:angular');
  entries: RequestEntry[] = [];

  init(config: PistoletConfig) {
    AngularBackend.instance = this;
  }

  process(request: Request, response: Response) {
    this.debug('Received %s %s', request.method, request.url);
    this.entries.push({ method: request.method, path: request.url });
    this.emit('request', request, response);
  }

  requestsMade() {
    return this.entries;
  }

  start() {
  }

  reset() {
    this.entries = [];
  }

  stop() {
  }
}
