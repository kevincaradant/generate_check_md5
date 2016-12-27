#!/usr/bin/env node
require('babel-polyfill');
const generateCheckMd5 = require('./generate-check-md5');
generateCheckMd5.generate();
