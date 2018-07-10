// ------------------------------------------------------------------------------------------
// setup
// ------------------------------------------------------------------------------------------

import path from 'path'
import license from 'rollup-plugin-license'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import buble from 'rollup-plugin-buble'
import typescript from 'rollup-plugin-typescript2'
import nodeResolve from 'rollup-plugin-node-resolve'

const pkg = require('../package.json')
const external = Object.keys(pkg.dependencies || {})
const name = pkg.name
const className = name.replace(/(^\w|-\w)/g, c => c.replace('-', '').toUpperCase())

function output (ext, format = 'umd') {
  return {
    name: className,
    file: `dist/${name}.${ext}`,
    format: format,
    // exports: 'default',
  }
}

// ------------------------------------------------------------------------------------------
// build
// ------------------------------------------------------------------------------------------

const umd = {
  input: 'src/main.js',
  external: external,
  output: output('js'),
  plugins: [
    nodeResolve({
      jsnext: true,
      extensions: [ '.ts', '.js', '.json' ]
    }),
    typescript(),
    license({
      banner: {
        file: path.join(__dirname, 'banner.txt')
      },
    }),
    commonjs(),
    buble()
  ]
}

const min = Object.assign({}, umd, {
  output: output('min.js'),
  plugins: [...umd.plugins, uglify()]
})

const es = Object.assign({}, umd, {
  output: output('esm.js', 'es')
})

export default [umd, min, es]