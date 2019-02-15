import cors from 'cors';
import { EventEmitter } from 'events';
import express, { Application, json, RequestHandler } from 'express';
import { Server } from 'http';

import { Backend, RequestEntry } from '../../backend';
import { ExpressPistoletConfig } from './config';

export class ExpressBackend extends EventEmitter implements Backend {
  debug = require('debug')('pistolet:express');

  app: Application;
  config: ExpressPistoletConfig;
  entries: RequestEntry[] = [];
  server: Server;

  init(config: ExpressPistoletConfig) {
    this.config = config;
    const app = this.app = express();
    app.use(cors({
      credentials: true,
      origin: (origin, callback) => callback(null, true),
    }));
    app.use(json());
    app.use(this.logMiddleware());
    (this.config.middlewares || []).forEach((middleware) => app.use(middleware));
  }

  logMiddleware(): RequestHandler {
    return ((req, res, next) => {
      this.entries.push({ method: req.method, path: req.url });
      next();
    });
  }

  requestsMade() {
    return this.entries;
  }

  reset() {
    this.entries = [];
  }

  start() {
    this.debug('Starting on port %d', this.config.port);
    this.server = this.app.listen(this.config.port);
    this.app.all('*', (request, response) => {
      this.debug('Received %s %s', request.method, request.url);
      this.emit('request', request, response);
    });
  }

  stop() {
    this.server.close();
  }
}
