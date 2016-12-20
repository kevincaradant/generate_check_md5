const utils = require('./utils.js');
const fs = require('fs');
const clc = require('cli-color');

const error = clc.red.bold;
const warn = clc.yellow.bold;
const notice = clc.blue.bold;

// --------------
// --- CHECKS ---
// --------------
// FALSE => We have a problem
// TRUE => Everything is good

const checkHelp = (pArgvH, pArgvHelp) => {
  if (pArgvH || pArgvHelp) {
    console.log(notice(utils.showHelp()));
    return false;
  }
  return true;
};

const checkAllParamsFromUser = (pArgumentsAllowedArray, pArgumentsSendByUser) => {
  if (!utils.findElemInArray(pArgumentsAllowedArray, pArgumentsSendByUser)) {
    console.log(error('\nYou doesn\'t use allowed params.') + notice('\nDo --h or --help for more informations'));
    return false;
  }
  return true;
};

const isExistAtLeastOneParamFromUser = (pArgumentsAllowedArray, pArgumentsSendByUser) => {
  if (!utils.findAtLeastOneElemInArray(pArgumentsAllowedArray, pArgumentsSendByUser)) {
    console.log(error('\nYou should pass arguments to use this module'));
    return false;
  }
  return true;
};

const isPathCorrect = pArgvPath => {
  if (pArgvPath) {
    if (typeof pArgvPath !== 'string') {
      console.log(error('\nArgument --path: The path is not correct.') + notice('\nUse: --path "your/path/and/your-folder-name"'));
      return false;
    }

    return new Promise(resolve => {
      fs.stat(pArgvPath, (err, stats) => {
        if (err && err.code === 'ENOENT') {
          console.log(error(`\nArgument --path: No file found. Check your path`));
          return resolve(false);
        } else if (err) {
          console.log(error(`\nArgument --path: ${err}`));
          return resolve(false);
        }	else if (stats.isFile()) {
          console.log(error(`\nArgument --path: Is a file instead of a directory`));
          return resolve(false);
        }
        return resolve(true);
      });
    });
  }
  return false;
};

const isDestCorrect = pArgvDest => {
  if (pArgvDest) {
    if (typeof pArgvDest !== 'string') {
      console.log(error('\nArgument --dest: The path is not correct.') + notice('\nUse: --dest "your/path/and/your-file.txt"'));
      return false;
    }

    return new Promise(resolve => {
      fs.stat(pArgvDest, (err, stats) => {
        if (err && err.code === 'ENOENT') {
          console.log(notice('\nArgument --dest: New file located at ' + pArgvDest + ' will be created'));
          return resolve(true);
        } else if (err) {
          console.log(error(`\nArgument --dest: ${err}`));
          return resolve(false);
        }	else if (stats.isDirectory()) {
          console.log(error(`\nArgument --dest: Is a directory instead of a file`));
          return resolve(false);
        }
        return resolve(true);
      });
    });
  }
  return false;
};

const isSourceCorrect = pArgvSource => {
  if (pArgvSource) {
    if (typeof pArgvSource !== 'string') {
      console.log(error('\nArgument --source: The path is not correct.') + notice('\nUse: --source "your/path/and/your-source-file.txt"'));
      return false;
    }

    return new Promise(resolve => {
      fs.stat(pArgvSource, (err, stats) => {
        if (err && err.code === 'ENOENT') {
          console.log(error(`\nArgument --source: No file found. Check your path`));
          return resolve(false);
        } else if (err) {
          console.log(error(`\nArgument --source: ${err}`));
          return resolve(false);
        }	else if (stats.isDirectory()) {
          console.log(error(`\nArgument --source: Is a directory instead of a file`));
          return resolve(false);
        }
        return resolve(true);
      });
    });
  }
  return false;
};

const isCompareCorrect = pArgvCompare => {
  if (pArgvCompare) {
    if (typeof pArgvCompare !== 'string') {
      console.log(error('\nArgument --compare: The path is not correct.') + notice('\nUse: --compare "your/path/and/your-compare-file.txt"'));
      return false;
    }

    return new Promise(resolve => {
      fs.stat(pArgvCompare, (err, stats) => {
        if (err && err.code === 'ENOENT') {
          console.log(error(`\nArgument --compare: No file found. Check your path`));
          return resolve(false);
        } else if (err) {
          console.log(error(`\nArgument --compare: ${err}`));
          return resolve(false);
        }	else if (stats.isDirectory()) {
          console.log(error(`\nArgument --compare: Is a directory instead of a file`));
          return resolve(false);
        }
        return resolve(true);
      });
    });
  }
  return false;
};

const showPathError = pArgvPath => {
  if (!pArgvPath) {
    console.log(error('\nArgument --path: You should give the path of a folder to analyze it.') + notice('\nUse: --path "your/path/and/your-folder-name"'));
    return false;
  }
  return true;
};

const showDestError = pArgvDest => {
  if (!pArgvDest) {
    console.log(warn('\nArgument --dest: You should give the destination path to write the results in a file.') + notice('\nUse: --dest "your/path/and/your-file.txt".\nIn the moment, the results will be only show in the console.'));
    return false;
  }
  return true;
};

const showSourceError = pArgvSource => {
  if (!pArgvSource) {
    console.log(error('\nArgument --source: You should give the path of a folder to compare it.') + notice('\nUse: --source "your/path/and/your-source-file.txt"'));
    return false;
  }
  return true;
};

const showCompareError = pArgvCompare => {
  if (!pArgvCompare) {
    console.log(error('\nArgument --compare: You should give the path of a folder to compare it.') + notice('\nUse: --compare "your/path/and/your-file.txt"'));
    return false;
  }
  return true;
};

const showRewriteUpdateError = (pArgvUpdate, pArgvRewrite) => {
  if (pArgvUpdate && pArgvRewrite) {
    console.log(error('\nArguments --update && --rewrite: You can\'t give these two parameters in the same time.') + notice('\nUse --update or --rewrite'));
    return false;
  }
  return true;
};

// ------------------
// --- END CHECKS ---
// ------------------

module.exports = {
  checkHelp,
  checkAllParamsFromUser,
  isExistAtLeastOneParamFromUser,
  isPathCorrect,
  isDestCorrect,
  isSourceCorrect,
  isCompareCorrect,
  showPathError,
  showDestError,
  showSourceError,
  showCompareError,
  showRewriteUpdateError
};
