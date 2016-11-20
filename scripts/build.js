#!/usr/bin/env node
'use strict'
const fs = require('fs')
const path = require('path')
const rollup = require('rollup').rollup
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')

const rootPath = path.resolve(__dirname, '..', '..', '..')

function build() {
  const pkg = require(path.join(rootPath, 'package.json'))

  return Promise.all([
    bundle(pkg, 'node', 'cjs', true),
    bundle(pkg, 'browser', 'umd', false)
  ])
}

function bundle(pkg, target, format, external) {
  return rollup(optionsFor(pkg, external)).then(function(bundle) {
    return bundle.write({
      dest: path.join(rootPath, 'dist', `${pkg.name}.${target}.js`),
      format: format,
      moduleName: pkg.name.replace(/-(\w)/, g => g[1].toUpperCase())
    })
  })
  .catch(function(err) { console.log(err.message) })
}

function optionsFor(pkg, external) {
  return {
    entry: path.join(rootPath, 'index.js'),
    external: external ? Object.keys(pkg.dependencies) : null,
    plugins: [
      resolve(),
      babel({ exclude: 'node_modules/**' })
    ],
    onwarn: function() {}
  }
}

/* ────────────────────────────────────────────────────────────────────────── */

build()
