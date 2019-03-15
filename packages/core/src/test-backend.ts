import { EventEmitter } from 'events';
import { Backend, Request, RequestEntry, Response } from './backend';

export class TestBackend extends EventEmitter implements Backend {
  static instance: TestBackend;
  static request(request: Request) {
    return this.instance.request(request);
  }

  entries = new Array<RequestEntry>();

  init = jasmine.createSpy('init');
  requestsMade = jasmine.createSpy('requestsMade').and.callFake(() => this.entries);
  reset = jasmine.createSpy('reset').and.callFake(() => this.entries = []);
  start = jasmine.createSpy('start');
  stop = jasmine.createSpy('stop');

  constructor() {
    super();
    TestBackend.instance = this;
  }

  request(request: Request): Promise<{ statusCode: number, body: string | object }> {
    this.entries.push({ method: request.method, path: request.url });
    return new Promise((resolve) => {
      let statusCode: number;
      this.emit('request', request, {
        send: jasmine.createSpy('send').and.callFake((body) => resolve({ body, statusCode })),
        status: jasmine.createSpy('status').and.callFake((code) => statusCode = code),
      } as Response);
    });
  }
}
