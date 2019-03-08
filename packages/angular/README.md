# Pistolet Angular Plugin

[![Build Status](https://travis-ci.org/FrenchHipster/pistolet.svg?branch=master)](https://travis-ci.org/FrenchHipster/pistolet)
[![npm version](https://badge.fury.io/js/pistolet-angular.svg)](https://badge.fury.io/js/pistolet-angular)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

This plugin will mock Angular's `HttpClient` during Angular unit tests.


## Installation & Configuration

    $ npm install pistolet-angular --save-dev

In `src/test.ts`, add the following lines:

```typescript
import { setConfig } from 'pistolet';
import { AngularBackend } from 'pistolet-angular';

beforeAll(() => setConfig({
  backend: AngularBackend,
  dir: '',
}));
```


## Unit tests

In addition to normal usage, you need to provide Pistolet's HttpClientModule:
```typescript
TestBed.configureTestingModule({
  imports: [ 
    HttpClientModule,
  ],
});
```

A full example is available [here](https://github.com/FrenchHipster/pistolet/blob/master/examples/angular/src/app/app.component.spec.ts).


### (!) Known issue with JSON Scenarios

Unfortunately, there are compatibility issues between JSON files and the way Webpack works for Angular.  
As such, JSON scenarios need to be manually loaded in order to work:

```typescript
new Pistolet([ require('src/scenarios/sampleGet.json') ]);
```

Instead of the regular syntax:
```typescript
new Pistolet([ 'src/scenarios/sampleGet.json' ]);
```


## Protractor e2e tests

[`pistolet-express`](https://www.npmjs.com/package/pistolet-express) is required for Angular e2e tests.

Ensure the following options are present in `protractor.conf.js`:

```javascript
exports.config = {
  restartBrowserBetweenTests: true,
  SELENIUM_PROMISE_MANAGER: false,
  onPrepare() {
    require('pistolet').setConfig({
      backend: require('pistolet-express').ExpressBackend,
      port: 8080,
      dir: require('path').resolve(__dirname, 'scenarios'),
    });
  },
};
```

### (!) Known issue with Selenium's ControlFlow

As of now, Pistolet is not compatible with Selenium's ControlFlow, which is why it is disabled in the example above.

Alternatively, here is a workaround:

```javascript
// Below require('pistolet').setConfig(/* ... */);
const { browser } = require('protractor');
const _requestMade = require('pistolet').Pistolet.prototype.requestsMade;
require('pistolet').Pistolet.prototype.requestsMade = function () {
  return browser.controlFlow().execute(() => _requestMade.apply(this));
};
```
