# Pistolet Express Plugin

[![Build Status](https://travis-ci.org/FrenchHipster/pistolet.svg?branch=master)](https://travis-ci.org/FrenchHipster/pistolet)
[![npm version](https://badge.fury.io/js/pistolet-express.svg)](https://badge.fury.io/js/pistolet-express)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

This plugin will mock Angular's `HttpClient` during Angular unit tests.


## Installation & Configuration

    $ npm install pistolet-express --save-dev

Initialize Pistolet:
```javascript
require('pistolet').setConfig({
  backend: require('pistolet-express').ExpressBackend,
  port: 8080,
  dir: require('path').resolve(__dirname, 'scenarios'),
});
```
