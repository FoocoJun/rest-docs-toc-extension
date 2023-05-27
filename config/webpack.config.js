const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = merge(common, {
  entry: {
    contents: PATHS.src + '/contents/contents.js',
    background: PATHS.src + '/background.js',
  },
});

module.exports = config;
