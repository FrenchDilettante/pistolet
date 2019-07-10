export interface RequestMock {
  path: string;
  method?: string;
  body?: object | string;
}

export interface ResponseMock {
  data: object | string;
  status?: number;
}

export interface Mock {
  name?: string;
  request: RequestMock;
  response: ResponseMock;
}

export type MockMatch = Mock | boolean | undefined;
