# Pistolet

[![Build Status](https://travis-ci.org/FrenchHipster/pistolet.svg?branch=master)](https://travis-ci.org/FrenchHipster/pistolet)
[![npm version](https://badge.fury.io/js/pistolet.svg)](https://badge.fury.io/js/pistolet)

Pistolet (pronounced pistol-eh) is a Javascript testing tool to create mock API responses.

## Installation

    $ npm install pistolet --save-dev

## Configuration

### Available configuration options

```javascript
require('pistolet').setConfig({
  dir: path.join(__dirname, 'scenarios'),
  port: 8080,
});
```

### Protractor

Pistolet works with [Protractor](https://www.protractortest.org/).
Ensure the following options are present in `protractor.conf.js`:

```javascript
restartBrowserBetweenTests: true,
onPrepare() {
  require('pistolet').setConfig({
    dir: path.join(__dirname, 'scenarios'),
  });
}
````

## Usage

```javascript
describe('your test suite', () => {
  beforeAll(() => {
    server = new Pistolet([
      'scenario/from/json/file',
      new ClassScenario(),
      objectScenario
    ]);
  });

  // Required, otherwise the server keeps running and occupies the TCP port
  afterAll(() => server.stop());

  // Optional step, in case the scenarios you use are stateful
  afterEach(() => server.reset());
});
```

## Writing scenarios

### JSON file

JSON scenarios are the easiest to write and use.

Make sure to set the `dir` property in the configuration for Pistolet to know where to find these files.

```json
{
  "name": "The name is purely optional, for developers convenience",
  "request": {
    "method": "GET",
    "path": "/your/api/path"
  },
  "response": {
    "status": 200,
    "data": {
      "some": "response"
    }
  }
}
```

### Javascript/Typescript object

```typescript
export const SampleScenario: Scenario = {
  mocks: [/* ... */],
  next(request: Request, response: Response, match: Mock) {
    // optional function to manually handle requests
  }
}
```

### Javascript/Typescript class

```typescript
import { Mock, Scenario } from 'pistolet';
export class SampleScenario implements Scenario {
  mocks: Mock[] = [/* ... */];
  next(request: Request, response: Response, match: Mock) {
    // optional function to manually handle requests
  }
}
```