import { terser } from 'rollup-plugin-terser'
import json from '@rollup/plugin-json'
import image from '@rollup/plugin-image'
import resolve from '@rollup/plugin-node-resolve'
import cjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import copy from 'rollup-plugin-copy'
import { babel } from '@rollup/plugin-babel'
import nodePolyfills from 'rollup-plugin-node-polyfills'

export default [
  ...[
    {
      input: 'public/scripts/auth/index.js',
      name: 'auth'
    },
    {
      input: 'public/scripts/app/index.js',
      name: 'app'
    }
  ].map(({ input, name }) => {
    return {
      input,
      output: {
        dir: 'dist/scripts',
        format: 'es',
        entryFileNames: `${name}.js`
      },
      plugins: [
        nodePolyfills(),
        resolve(),
        babel({ babelHelpers: 'bundled' }),
        image(),
        json(),
        cjs(),
        terser()
      ]
    }
  }),
  {
    input: 'public/styles/index.scss',
    output: {
      file: 'dist/styles/index.css',
      format: 'es'
    },
    plugins: [
      postcss({
        extract: true,
        minimize: false
      }),
      copy({
        targets: [
          { src: 'public/images/**/*', dest: 'dist/images' },
          { src: 'public/fonts/**/*', dest: 'dist/fonts' },
          { src: 'manifest.json', dest: 'dist' }
        ]
      })
    ]
  }
]
