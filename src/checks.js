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

// Show the help text
const showHelp = () => {
  return `
  PARAMS:

  To generate MD5 on console (only) :
  --path "/path/to/the/my_directory_with_files/"

  To generate MD5 and write it in the file :
  --path "/path/to/the/my_directory_with_files/"
  --dest "/path/to/write/file_md5_results.txt"

  To compare md5 files :
  --source "/path/to/the/md5_file_source_its_the_reference.txt/"
  --compare "/path/to/the/md5_file_to_be_compared_with_source_file.txt/"

  To generate AND compare md5 files in the same time:
  --path "/path/to/the/my_directory_with_files/"
  --dest "/path/to/write/file_md5_results.txt"
  --source "/path/to/the/md5_file_source_its_the_reference.txt/"
  --compare "/path/to/the/md5_file_to_be_compared_with_source_file.txt/"

  OPTIONS:

  To rename files name in the file of results without space :
  --nospace
  Example:
  Before: /Folder1/my file for example.mkv a9asd1171dd83e122598af664bd3f785)
  After: /Folder1/my_file_for_example.mkv a9asd1171dd83e122598af664bd3f785)

  To ask only an update between a path and your md5 files :
  --update
  NB: By default, if you don't specify --update or --rewrite, it's the argument --update which is selected

  To rewrite completely your md5 files got with --dest :
  --rewrite`;
};

// Return true: Help arg not called
// Return false: Help arg was called
const checkHelp = (pArgvH, pArgvHelp) => {
  if (pArgvH || pArgvHelp) {
    console.log(notice(showHelp()));
    return false;
  }
  return true;
};

// Return true if all the elements in pArr are included in pHaystack
// Return false if at least one arg in pArr is not included in pHaystack
const findElemInArray = (pHaystack, pArr) => {
  return pArr.every(v => {
    return pHaystack.indexOf(v) >= 0;
  });
};

// Return true if at least one element in pArr is included in pHaystack
// Return false if any arg in pArr are included in pHaystack
const findAtLeastOneElemInArray = (pHaystack, pArr) => {
  return pArr.some(v => {
    return pHaystack.indexOf(v) >= 0;
  });
};

// Return true: ALl arguments exists.
// Return false: One or more arguments doesn't exist
const checkAllParamsFromUser = (pArgumentsAllowedArray, pArgumentsSendByUser) => {
  if (!findElemInArray(pArgumentsAllowedArray, pArgumentsSendByUser)) {
    console.log(error('\nYou doesn\'t use allowed params.') + notice('\nDo --h or --help for more informations'));
    return false;
  }
  return true;
};

// Return true: At least  one argument exists.
// Return false: Any argument exist
const isExistAtLeastOneParamFromUser = (pArgumentsAllowedArray, pArgumentsSendByUser) => {
  if (!findAtLeastOneElemInArray(pArgumentsAllowedArray, pArgumentsSendByUser)) {
    console.log(error('\nYou should pass valid arguments to use this module'));
    return false;
  }
  return true;
};

// Return true: --path arg is correct
// Return false: --path arg is not correct
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

// Return true: --dest arg is correct
// Return false: --dest arg is not correct
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
          // If openSync returns 2 when it's a successful.
          // fs.closeSync returns undefined if it's arg has 2 as value.
          // So if we get undefined, it's a successful otherwise we have an other code.
          if (typeof fs.closeSync(fs.openSync(pArgvDest, 'a')) !== 'undefined') {
            console.log(error('\nArgument --dest: Error during the creation of the new file ' + pArgvDest));
            return resolve(false);
          }
          console.log(notice('\nArgument --dest: New file ' + pArgvDest + ' created with successful'));
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
  return true;
};

// Return true: --source arg is correct
// Return false: --source arg is not correct
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

// Return true: --compare arg is correct
// Return false: --compare arg is not correct
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

// Return true: --path arg exist
// Return false: --path arg doesn't not exist
const showPathError = pArgvPath => {
  if (!pArgvPath) {
    console.log(error('\nArgument --path: You should give the path of a folder to analyze it.') + notice('\nUse: --path "your/path/and/your-folder-name"'));
    return false;
  }
  return true;
};

// Return true: --dest arg exist
// Return false: --dest arg doesn't not exist
const showDestError = pArgvDest => {
  if (!pArgvDest) {
    console.log(warn('\nArgument --dest: You should give the destination path to write the results in a file.\nUse: --dest "your/path/and/your-file.txt".\nIn the moment, the results will be only show in the console.'));
  }
  return true;
};

// Return true: --source arg exist
// Return false: --source arg doesn't not exist
const showSourceError = pArgvSource => {
  if (!pArgvSource) {
    console.log(error('\nArgument --source: You should give the path of a folder to compare it.') + notice('\nUse: --source "your/path/and/your-source-file.txt"'));
    return false;
  }
  return true;
};

// Return true: --compare arg exist
// Return false: --compare arg doesn't not exist
const showCompareError = pArgvCompare => {
  if (!pArgvCompare) {
    console.log(error('\nArgument --compare: You should give the path of a folder to compare it.') + notice('\nUse: --compare "your/path/and/your-file.txt"'));
    return false;
  }
  return true;
};

// Return true: --rewrite or --update  or any of these arg exist
// Return false: --rewrite arg doesn't not exist
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
  showHelp,
  findAtLeastOneElemInArray,
  findElemInArray,
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
