import { Request, Response } from 'express';
import { Mock, MockMatch } from './mock';

export interface Scenario {
  mocks: Mock[];
  next(request: Request, response: Response, match: Mock): MockMatch;
  reset?(): void;
  stop?(): void;
}
