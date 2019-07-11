import { HttpClient as NgHttpClient } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { Response } from 'pistolet';
import { ReplaySubject } from 'rxjs';
import { AngularBackend } from './angular-backend';

class RxResponse<T = any> extends ReplaySubject<T> implements Response {
  statusCode = 200;

  constructor() {
    super(1);
  }

  send(body: T): Response {
    if (this.statusCode >= 200 && this.statusCode < 400) {
      this.next(body);
    } else {
      this.error(body);
    }
    return this;
  }

  status(code: number): Response {
    this.statusCode = code;
    return this;
  }
}

@Injectable()
export class HttpClient {
  backend = AngularBackend.instance;

  delete(url: string) {
    return this.request('DELETE', url);
  }

  get(url: string) {
    return this.request('GET', url);
  }

  patch(url: string, body?: any) {
    return this.request('PATCH', url, body);
  }

  post(url: string, body?: any) {
    return this.request('POST', url, body);
  }

  put(url: string, body?: any) {
    return this.request('PUT', url, body);
  }

  request(method: string, url: string, body?: any) {
    const response = new RxResponse();
    this.backend.process({ method, path: url, url, body }, response);
    return response;
  }
}

@NgModule({
  providers: [{ provide: NgHttpClient, useClass: HttpClient }],
})
export class HttpClientModule { }
