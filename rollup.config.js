import { terser } from 'rollup-plugin-terser'
import json from '@rollup/plugin-json'
import image from '@rollup/plugin-image'
import styles from 'rollup-plugin-styles'
import resolve from '@rollup/plugin-node-resolve'
import cjs from '@rollup/plugin-commonjs'

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
        dir: 'build',
        format: 'esm',
        entryFileNames: `${name}-[hash].js`
      },
      plugins: [
        resolve(),
        image(),
        json(),
        cjs({ include: /node_modules/ }),
        terser()
      ]
    }
  }),
  {
    input: 'public/styles/index.scss',
    output: {
      file: 'build/style.css'
    },
    plugins: [
      image(),
      styles({ mode: 'extract' })
    ]
  }
]
