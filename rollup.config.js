import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const external = [
  'cors',
  'debug',
  'events',
  'express',
  'http',
  'path',
];

export default [{
  input: 'src/index.ts',
  external,
  plugins: [
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
        },
        exclude: ['**/*.spec.ts', 'examples/**/*.ts'],
      },
    }),
  ],
  output: {
    file: pkg.main,
    format: 'cjs',
  },
}, {
  input: 'src/backends/express/index.ts',
  external,
  plugins: [
    typescript({
      tsconfigOverride: {
        exclude: ['**/*.spec.ts', 'examples/**/*.ts'],
      },
    }),
  ],
  output: {
    file: 'backends/express.js',
    format: 'cjs',
  },
}];
