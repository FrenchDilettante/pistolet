import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const typescriptPlugin = typescript({
  tsconfigOverride: {
    exclude: ['**/*.spec.ts', 'examples/**/*.ts'],
  },
});

export default [{
  input: 'src/index.ts',
  external: [
    'debug',
  ],
  plugins: [ typescriptPlugin ],
  output: {
    file: pkg.main,
    format: 'umd',
    name: pkg.name,
  },
}, {
  input: 'src/backends/angular/index.ts',
  external: [
    '@angular/common/http',
    '@angular/core',
    'debug',
    'events',
    'rxjs',
  ],
  plugins: [ typescriptPlugin ],
  output: {
    file: 'backends/angular.js',
    format: 'esm',
  },
}, {
  input: 'src/backends/express/index.ts',
  external: [
    'cors',
    'debug',
    'events',
    'express',
  ],
  plugins: [ typescriptPlugin ],
  output: {
    file: 'backends/express.js',
    format: 'cjs',
  },
}];
