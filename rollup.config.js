import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import commonjs from 'rollup-plugin-commonjs';
import serve from 'rollup-plugin-serve';
import minify from 'rollup-plugin-babel-minify';
import nodeResolve from 'rollup-plugin-node-resolve';
import progress from 'rollup-plugin-progress';
import sizes from 'rollup-plugin-sizes';
import typescript from 'rollup-plugin-typescript2';

const isdev = process.env.ROLLUP_WATCH;

const opts_babel = {
  exclude: 'node_modules/**',
};

const opts_serve = {
  contentBase: ['./dist'],
  host: '0.0.0.0',
  port: 5000,
  allowCrossOrigin: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

const opts_cleanup = {
  comments: 'none',
};

const opts_sizes = {
  details: true,
};

const AwesomePlugins = [
  progress(),
  nodeResolve(),
  commonjs(),
  typescript(),
  babel(opts_babel),
  !isdev && minify(),
  !isdev && terser(),
  !isdev && cleanup(opts_cleanup),
  isdev && sizes(opts_sizes),
  isdev && serve(opts_serve),
];

export default [
  {
    input: ['src/favicon-counter.ts'],
    output: {
      file: `dist/favicon-counter.js`,
      format: 'es',
    },
    plugins: [...AwesomePlugins],
  },
];
