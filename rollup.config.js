import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { eslint } from 'rollup-plugin-eslint';
import json from '@rollup/plugin-json';

const is_watch = !!process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.js',

  output: {
    file: 'dist/js/main.min.js',
    format: 'es',
    name: 'leprechaun'
  },

  plugins: [
    copy({
      targets: [
        { src: 'src/assets/**/*', dest: 'dist/assets' }
      ]
    }),

    commonjs(),

    nodeResolve({
      include: /node_modules/,
      browser: true,
      requireReturnsDefault: 'auto'
    }),

    json(),

    eslint({
      exclude: ['src/assets/**'],
    }),

    is_watch && serve({
      contentBase: 'dist',
      open: true,
    }),

    is_watch && livereload('dist'),

    !is_watch && terser(),
  ],
};
