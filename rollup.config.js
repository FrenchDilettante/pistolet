import typescript from 'rollup-plugin-typescript2';

function typescriptPlugin(subfolder) {
  return typescript({
    tsconfigOverride: {
      declarationDir: `packages/${subfolder}/dist`,
      include: [ `packages/${subfolder}/src/*` ],
      exclude: [ '**/*.spec.ts' ],
    },
  });
}

export default [{
  input: 'packages/core/src/index.ts',
  external: [
    'debug',
    'fs',
  ],
  plugins: [ typescriptPlugin('core') ],
  output: {
    file: 'packages/core/dist/pistolet.js',
    format: 'umd',
    name: 'pistolet',
    globals: {
      fs: 'fs',
    },
  },
}, {
  input: 'packages/angular/src/index.ts',
  external: [
    '@angular/common/http',
    '@angular/core',
    'debug',
    'events',
    'rxjs',
  ],
  plugins: [ typescriptPlugin('angular') ],
  output: {
    file: 'packages/angular/dist/pistolet-angular.js',
    format: 'esm',
  },
}, {
  input: 'packages/express/src/index.ts',
  external: [
    'cors',
    'debug',
    'events',
    'express',
  ],
  plugins: [ typescriptPlugin('express') ],
  output: {
    file: 'packages/express/dist/pistolet-express.js',
    format: 'cjs',
  },
}];
