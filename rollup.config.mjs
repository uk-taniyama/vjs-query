import { writeFileSync } from 'fs';

import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import dtsMergeInterface from 'dts-merge-interface/rollup-plugin';
import { dts } from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import { visualizer } from 'rollup-plugin-visualizer';

const watch = process.env.ROLLUP_WATCH === 'true';

const commonPlugins = [
  json(),
  esbuild({
    exclude: ['**/*test*', 'test/**'],
    sourceMap: true,
  }),
  resolve({
    mainFields: ['module', 'main'],
    extensions: ['.ts', '.mjs', '.cjs', '.js', '.jsx', '.json', '.node'],
    modulesOnly: true,
  }),
  commonjs(),
  visualizer({
    filename: 'log/stats.html',
  }),
];

const dtsPlugins = [
  dts(),
  dtsMergeInterface(),
];

const dirs = [
  '.',
];

const exports = dirs.reduce((prev, dir) => ({
  ...prev,
  [dir]: {
    types: `./dist/${dir}/index.d.ts`.replace('/./', '/'),
    import: `./dist/${dir}/index.mjs`.replace('/./', '/'),
    require: `./dist/${dir}/index.cjs`.replace('/./', '/'),
  },
}), {});
writeFileSync('package.exports.json', JSON.stringify(exports, null, 2));

const config = dirs.map((dir) => [
  { format: 'esm', ext: '.mjs', plugins: commonPlugins },
  { format: 'cjs', ext: '.cjs', plugins: commonPlugins },
  { format: 'es', ext: '.d.ts', plugins: dtsPlugins },
]
  .filter(({ format }) => watch === false || format !== 'cjs')
  .map(({
    format, ext, plugins, banner,
  }) => ({
    plugins,
    input: `src/${dir}/index.ts`.replace('/./', '/'),
    output: {
      format,
      banner,
      exports: 'named',
      file: `dist/${dir}/index${ext}`.replace('/./', '/'),
    },
    // external: (id, parentId, isResolved) => {
    //   console.log(id, parentId, isResolved);
    //   if (parentId == null) {
    //     return false;
    //   }
    //   if (id.indexOf('node_modules') > 0) {
    //     return true;
    //   }
    //   if (parentId.indexOf('openapi')) {
    //     return false;
    //   }
    //   if (id.startsWith('../shared/')) {
    //     return false;
    //   }
    //   if (id.startsWith('../')) {
    //     return true;
    //   }
    //   return false;
    // }
    external: /node_modules/,
  })))
  .reduce((prev, curr) => [...prev, ...curr], []);
export default config;
