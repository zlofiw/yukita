'use strict';

const path = require('node:path');

const docsDistPath = path.resolve(__dirname, 'dist');

module.exports = docsDistPath;
module.exports.default = docsDistPath;
module.exports.docsDistPath = docsDistPath;