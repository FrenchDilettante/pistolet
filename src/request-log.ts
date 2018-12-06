import { Request, RequestHandler, Response } from 'express';

export interface RequestEntry {
  method: string;
  path: string;
}

export class RequestLog {
  entries: RequestEntry[] = [];

  clear() {
    this.entries = [];
  }

  middleware(): RequestHandler {
    return (req: Request, res: Response, next) => {
      this.entries.push({ method: req.method, path: req.path });
      next();
    };
  }
}
