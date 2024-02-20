import { writeFileSync } from 'fs-extra';
import path from 'node:path';
import { defineBuildConfig } from 'unbuild';
import { transformFileSync } from '@swc/core';

export default defineBuildConfig({
  entries: ['src/index'],
  outDir: 'lib',
  declaration: true,
  clean: true,
  rollup: {
    inlineDependencies: true,
    esbuild: {
      // minify: true,
      format: 'esm',
    },
  },
  failOnWarn: false,
  hooks: {
    'build:done': async () => {
      const output = transformFileSync(path.resolve(__dirname, 'lib/index.mjs'), {
        jsc: {
          target: 'es3',
        },
      });
      writeFileSync(path.resolve(__dirname, 'lib/index.js'), output.code);
    },
  },
});
