'use strict';
var webpack = require('webpack');

var env = process.env.NODE_ENV;

var reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react',
};

var config = {
  externals: {
    react: reactExternal,
  },
  module: {
    loaders: [{ test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }],
  },
  output: {
    library: 'ReactWithDataHoc',
    libraryTarget: 'umd',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
  ],
};

if (env === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      },
    }),
  );
}

module.exports = config;
