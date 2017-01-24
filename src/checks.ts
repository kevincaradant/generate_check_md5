import * as fs from 'fs';
import * as clc from 'cli-color';

const error: any = clc.red.bold;
const warn: any = clc.yellow.bold;
const notice: any = clc.blue.bold;

// --------------
// --- CHECKS ---
// --------------
// FALSE => We have a problem
// TRUE => Everything is good
// Show the help text
export const showHelp = (): string => {
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
  To sort the output file with the arg --dest :
  --sort

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
export const checkHelp = (pArgvH?: boolean, pArgvHelp?: boolean): boolean => {
  if (pArgvH || pArgvHelp) {
    console.log(notice(showHelp()));
    return false;
  }
  return true;
};

// Return true if all the elements in pArr are included in pHaystack
// Return false if at least one arg in pArr is not included in pHaystack
export const findAllElemInArray = (pHaystack: Array<string>, pArr: Array<string>): boolean => {
  return pArr.every(v => {
    return (pHaystack.indexOf(v) >= 0);
  });
};

// Return true if at least one element in pArr is included in pHaystack
// Return false if any arg in pArr are included in pHaystack
export const isExistElemBetweenTwoArrays = (pHaystack: Array<string>, pArr: Array<string>): boolean => {
  return pArr.some(v => {
    return pHaystack.indexOf(v) >= 0;
  });
};

// Return true: All arguments exists.
// Return false: One or more arguments doesn't exist
export const checkAllParamsFromUser = (pArgumentsAllowedArray: Array<string>, pArgumentsSendByUser: Array<string>): boolean => {
  if (!findAllElemInArray(pArgumentsAllowedArray, pArgumentsSendByUser)) {
    console.error(error('\nYou doesn\'t use allowed params.') + notice('\nDo --h or --help for more information'));
    return false;
  }
  return true;
};

// Return true: At least  one argument exists.
// Return false: Any argument exist
export const isExistAtLeastOneParamFromUser = (pArgumentsAllowedArray: Array<string>, pArgumentsSendByUser: Array<string>): boolean => {
  if (!isExistElemBetweenTwoArrays(pArgumentsAllowedArray, pArgumentsSendByUser)) {
    console.error(error('\nYou should pass valid arguments to use this module'));
    return false;
  }
  return true;
};

// Check and write a message about the sitation with parameters
// Return true if it's the --dest argument
// Return false if it's different of --dest argument
export const _handlingArgvOnErrMessage = (err: any, pFile: string, pTypeArg?: string): boolean => {
  if (pTypeArg === 'dest') {
    console.log(notice(`\nArgument --${pTypeArg}: New file located at ${pFile} will be created`));
    if (typeof fs.closeSync(fs.openSync(pFile, 'a')) !== 'undefined') {
      console.error(error(`\nArgument --${pTypeArg}: Error during the creation of the new file ` + pFile));
    } else {
      console.log(notice(`\nArgument --${pTypeArg}: New file ${pTypeArg} created with successful`));
    }
    return true;
  }
  else {
    console.error(err + '\n' + error(`\nArgument --${pTypeArg}: No file found. Check your path`));
    return false;
  }
};

// Return true if it's a --path argument
// Return false if it's not a --path argument
export const _isPath = (pTypeArg = ''): boolean => {
  return pTypeArg === 'path';
};

// Return true if it's a --dest argument
// Return false if it's not a --dest argument
export const _isDest = (pTypeArg = ''): boolean => {
  return pTypeArg === 'dest';
};

// Return true if it's a --dest argument
// Return false if it's not a --dest argument
export const _isCompare = (pTypeArg = ''): boolean => {
  return pTypeArg === 'compare';
};

// Return true if it's a --source argument
// Return false if it's not a --source argument
export const _isSource = (pTypeArg = ''): boolean => {
  return pTypeArg === 'source';
};

// Return true if --isENOENTError argument is an ENOENT error
// Return false if --isENOENTError argument is not an ENOENT error
export const _isENOENTError = (pError: any): boolean => {
  return pError && pError.code === 'ENOENT';
};

// Return true if --isFile argument is a file
// Return false if --isFile argument is not a file
export const _isFile = (pType: any): boolean => {
  return pType.isFile();
};

// Return true if --isDirectory argument is a directory
// Return false if --isDirectory argument is not a directory
export const _isDirectory = (pType: any): boolean => {
  return pType.isDirectory();
};

// Return true if paths are corrects
// Return false if the path with the argument is bad or something goes wrong
export const _checkStateFiles = (pFile = '', pTypeArg = ''): Promise<boolean> => {
  return new Promise(resolve => {
    fs.stat(pFile, (err: any, stats: any) => {
      if (_isENOENTError(err)) {
        return resolve(_handlingArgvOnErrMessage(err, pFile, pTypeArg));
      } else if (err) {
        console.error(error(`\nArgument --${pTypeArg}: ${err}`));
        return resolve(false);
      } else if (_isFile(stats) && _isPath(pTypeArg)) {
        console.error(error(`\nArgument --${pTypeArg}: Is a file instead of a directory`));
        return resolve(false);
      } else if (_isDirectory(stats) && (_isSource(pTypeArg) || _isCompare(pTypeArg) || _isDest(pTypeArg))) {
        console.error(error(`\nArgument --${pTypeArg}: Is a directory instead of a file`));
        return resolve(false);
      }
      return resolve(true);
    });
  });
};

// Return true: --path arg is correct
// Return false: --path arg is not correct
export const isPathCorrect = (pArgvPath: Array<string> = []): Promise<Array<boolean>> => {
  if (pArgvPath.length === 0) {
    console.error(error('\nArgument --path: The path is not correct.') + notice('\nUse: --path "your/path/and/your-folder-name1" "your/path/and/your-folder2-name"'));
    return new Promise(resolve => resolve(false));
  }

  return new Promise(async (resolve) => {
    const rslts = await Promise.all(pArgvPath.map(async file => {
      return _checkStateFiles(file, 'path');
    }));
    resolve(rslts);
  });
};

// Return true: --dest arg is correct
// Return false: --dest arg is not correct
export const isDestCorrect = (pArgvDest = ''): Promise<boolean> => {
  if (pArgvDest) {
    return _checkStateFiles(pArgvDest, 'dest');
  }
  return new Promise(resolve => resolve(true));
};

// Return true: --source arg is correct
// Return false: --source arg is not correct
export const isSourceCorrect = (pArgvSource = ''): Promise<boolean> => {
  if (!pArgvSource) {
    console.error(error('\nArgument --source: The path is not correct.') + notice('\nUse: --source "your/path/and/your-source-file.txt"'));
    return new Promise(resolve => resolve(false));
  }
  return _checkStateFiles(pArgvSource, 'source');
};

// Return true: --compare arg is correct
// Return false: --compare arg is not correct
export const isCompareCorrect = (pArgvCompare = ''): Promise<boolean> => {
  if (!pArgvCompare) {
    console.error(error('\nArgument --compare: The path is not correct.') + notice('\nUse: --compare "your/path/and/your-compare-file.txt"'));
    return new Promise(resolve => resolve(false));
  }
  return _checkStateFiles(pArgvCompare, 'compare');
};

// Return true: --path arg exist
// Return false: --path arg doesn't not exist
export const showPathError = (pArgvPath: Array<string> = []): boolean => {
  if (pArgvPath.length === 0) {
    console.error(error('\nArgument --path: You should give the path of a folder to analyze it.') + notice('\nUse: --path "your/path/and/your-folder-name1" "your/path/and/your-folder-name2"'));
    return false;
  }
  return true;
};

// Return true: --dest arg exist
// Return false: --dest arg doesn't not exist
export const showDestError = (pArgvDest = ''): boolean => {
  if (!pArgvDest) {
    console.log(warn('\nArgument --dest: You should give the destination path to write the results in a file.\nUse: --dest "your/path/and/your-file.txt".\nIn the moment, the results will be only show in the console.'));
  }
  return true;
};

// Return true: --source arg exist
// Return false: --source arg doesn't not exist
export const showSourceError = (pArgvSource = ''): boolean => {
  if (!pArgvSource) {
    console.error(error('\nArgument --source: You should give the path of a folder to compare it.') + notice('\nUse: --source "your/path/and/your-source-file.txt"'));
    return false;
  }
  return true;
};

// Return true: --compare arg exist
// Return false: --compare arg doesn't not exist
export const showCompareError = (pArgvCompare = ''): boolean => {
  if (!pArgvCompare) {
    console.error(error('\nArgument --compare: You should give the path of a folder to compare it.') + notice('\nUse: --compare "your/path/and/your-file.txt"'));
    return false;
  }
  return true;
};

// Return true: --rewrite or --update  or any of these arg exist
// Return false: --rewrite arg doesn't not exist
export const showRewriteUpdateError = (pArgvUpdate = false, pArgvRewrite = false): boolean => {
  if (pArgvUpdate && pArgvRewrite) {
    console.error(error('\nArguments --update && --rewrite: You can\'t give these two parameters in the same time.') + notice('\nUse --update or --rewrite'));
    return false;
  }
  return true;
};

// ------------------
// --- END CHECKS ---
// ------------------
