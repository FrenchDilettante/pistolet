import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const main = 'src/main.ts';

export default {
  input: main,
  external: [
    'body-parser',
    'cors',
    'express',
    'http',
    'path',
  ],
  plugins: [
    typescript({
      tsconfigOverride: {
        exclude: [ '**/*.spec.ts' ],
      },
    }),
  ],
  output: { file: pkg.main, format: 'cjs' },
};
