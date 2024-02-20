import { rename, writeFileSync } from 'fs-extra';
import path from 'node:path';
import { defineBuildConfig } from 'unbuild';
import {transformFileSync} from '@swc/core';

export default defineBuildConfig({
  entries: ['src/index'],
  outDir: 'lib',
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
    esbuild: {
      // minify: true,
      target: 'node12',
    },
  },
  failOnWarn: false,
  hooks: {
    'build:done': async () => {
      const code = transformFileSync(path.resolve(__dirname, 'lib/index.cjs'), {
        jsc: {
          target: 'es3',
        },
      })
      writeFileSync(path.resolve(__dirname, 'lib/index.js'), code.code);
    },
  },
});
