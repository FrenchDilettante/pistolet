import { Request, Response } from 'express';
import { Mock } from './mock';

export interface Scenario {
  mocks?: Mock[];
  next(request: Request, response: Response, matches: Mock[]): Mock | boolean | void;
  reset?(): void;
  stop?(): void;
}
