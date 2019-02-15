import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const plugins = [
  typescript({
    useTsconfigDeclarationDir: true,
    tsconfigOverride: {
      compilerOptions: {
      },
      exclude: [ '**/*.spec.ts', 'examples/**/*.ts' ],
    },
  }),
];

export default [{
  input: 'src/index.ts',
  external: [
    'debug',
    'path',
  ],
  plugins,
  output: { file: pkg.main, format: 'cjs' },
}, {
  input: 'src/backends/express/index.ts',
  external: [
    'cors',
    'debug',
    'events',
    'express',
    'http',
    'path',
  ],
  plugins,
  output: {
    file: 'backends/express.js',
    format: 'cjs',
  },
}];
