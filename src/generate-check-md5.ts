// ----------------------------
// --- CONST AND GLOBAL VAR ---
// ----------------------------

import * as checks from './checks';
import * as utils from './utils';
const argv = require('yargs').array('path').argv;
import * as fs from 'fs';
import * as clc from 'cli-color';

export const generate = (): any => {
  const error: any = clc.red.bold;
  const success: any = clc.green.bold;
  const warn: any = clc.yellow.bold;
  const notice: any = clc.blue.bold;

  const argumentsAllowedArray: Array<string> = [
    'path',
    'nospace',
    'dest',
    'source',
    'compare',
    'rewrite',
    'update',
    'sort'
  ];

  const argumentsSendByUser: Array<string> = Object.keys(argv).filter(obj => obj !== '$0' && obj !== '_');

  // ----------------------------
  // --- CONST AND GLOBAL VAR ---
  // ----------------------------

  // ------------------
  // -----  CHECKS ----
  // ------------------

  // Check: If the user want show the help list
  if (!checks.checkHelp(argv.h, argv.help)) {
    return;
  }

  // Check: If all arguments are correct otherwise we reject the request
  if (!checks.checkAllParamsFromUser(argumentsAllowedArray, argumentsSendByUser)) {
    return;
  }

  // Check: If at least one argument is correct
  if (!checks.isExistAtLeastOneParamFromUser(argumentsAllowedArray, argumentsSendByUser)) {
    return;
  }

  // Checks: If --update and --rewrite argument are use in the same time.
  if (argv.rewrite && argv.update) {
    if (!checks.showRewriteUpdateError(argv.rewrite, argv.update)) {
      return;
    }
  }
  // Check if each argument are typed correctly otherwise we returned an error
  const checkArgWtOpt = async (pArgvPath = [], pArgvDest = '', pArgvSource = '', pArgvCompare = '') => {
    if ((pArgvPath.length > 0 || pArgvDest) && !pArgvSource && !pArgvCompare) {
      const rslts: Array<boolean> = await Promise.all([checks.isPathCorrect(pArgvPath), checks.showPathError(pArgvPath), checks.isDestCorrect(pArgvDest), checks.showDestError(pArgvDest)]);
      if (rslts.includes(false)) {
        process.exit(0);
      }
    } else if ((pArgvSource || pArgvCompare) && pArgvPath.length === 0 && !pArgvDest) {
      const rslts = await Promise.all([checks.isSourceCorrect(pArgvSource), checks.showSourceError(pArgvSource), checks.isCompareCorrect(pArgvCompare), checks.showCompareError(pArgvCompare)]);
      if (rslts.includes(false)) {
        process.exit(0);
      }
    } else {
      const rslts = await Promise.all([checks.isPathCorrect(pArgvPath), checks.showPathError(pArgvPath), checks.isDestCorrect(pArgvDest), checks.showDestError(pArgvDest)]);
      if (rslts.includes(false)) {
        process.exit(0);
      }
      const rslts2 = await Promise.all([checks.isSourceCorrect(pArgvSource), checks.showSourceError(pArgvSource), checks.isCompareCorrect(pArgvCompare), checks.showCompareError(pArgvCompare)]);
      if (rslts2.includes(false)) {
        process.exit(0);
      }
    }
  };

  // It's the case where we want to analyze the difference with a file and then returned the good results and show them
  const analyzeAndUpdateAndShowResults = async (pArgvDest = '', pFilesPath: Array<Set<string>>, pArgvNoSpace = false, pArgvSort = false): Promise<void> => {
    // We analyze to count the difference between the --path and --dest path
    console.log(warn(`GENERATOR MODE: Update in progress.`));
    const differenceDetected: { getNewFilesToAdd: Set<string>, getFilesToRemove: Set<string> } = await Promise.resolve<any>(utils.updateMD5(pArgvDest, pFilesPath[0], pArgvNoSpace));
    // If we don't have any diff
    if (differenceDetected.getNewFilesToAdd.size === 0 && differenceDetected.getFilesToRemove.size === 0) {
      // Sort the output file in the case of an update
      if (pArgvSort) {
        // If we want update the file, we create always a backup .bak of the --dest path
        fs.writeFileSync(pArgvDest + '.bak', fs.readFileSync(pArgvDest));
        console.log(success(`Backup of ${pArgvDest} successful!`));
        const filesToSort: Array<string> = await Promise.resolve<any>(utils.sortFileDest(`${pArgvDest}`));
        utils.quickDumpMD5FileDest(filesToSort, pArgvDest);
        console.log(success(`GENERATOR MODE: The output file: ${pArgvDest} was sorted with successful`));
      }
      console.log(success('GENERATOR MODE: No difference detected. Already up to date.'));
    } else {
      console.log(success(`${differenceDetected.getNewFilesToAdd.size + differenceDetected.getFilesToRemove.size} difference detected between the data gave via --path and --dest arguments`));
      utils.writeMD5FileDest(differenceDetected.getNewFilesToAdd, differenceDetected.getFilesToRemove, argv.rewrite, argv.nospace, pArgvDest);
      // Sort the output file in the case where we have anything to update
      if (pArgvSort) {
        const filesToSort: Array<string> = await Promise.resolve<any>(utils.sortFileDest(`${pArgvDest}`));
        utils.quickDumpMD5FileDest(filesToSort, pArgvDest);
        console.log(success(`GENERATOR MODE: The output file: ${pArgvDest} was sorted with successful`));
      }
    }
  };

  // ----------------------
  // -----  END CHECKS ----
  // ----------------------

  (async function () {
    await checkArgWtOpt(argv.path, argv.dest, argv.source, argv.compare);
    // ------------
    // --- ALGO ---
    // ------------
    // IF we have the --path argument
    if (argv.path) {
      // Get all files including in --path argument
      const filesPath = await utils.recursiveFolders(argv.path);
      console.log(notice(`\nGENERATOR MODE: ${filesPath[0].size} file${filesPath[0].size > 1 ? 's' : ''} detected.`));
      // If we have a file to write the results
      if (argv.dest) {
        // No --rewrite arg and the file with --dest path is already existing. (We can have --update arg)
        if (!argv.rewrite && fs.existsSync(argv.dest)) {
          await analyzeAndUpdateAndShowResults(argv.dest, filesPath, argv.nospace, argv.sort);
          // Otherwise if we have a --dest path but the file doesn't exist yet or we have the --rewrite argument
        } else if (argv.rewrite || !fs.existsSync(argv.dest)) {
          // We search and write all MD5 hash in a file or a console
          utils.writeMD5FileDest(filesPath[0], new Set<string>(), argv.dest, argv.rewrite, argv.nospace);
          // Sort the output file in the case of an rewrite
          if (argv.sort) {
            const filesToSort: Array<string> = await Promise.resolve<any>(utils.sortFileDest(`${argv.dest}`));
            utils.quickDumpMD5FileDest(filesToSort, argv.dest);
            console.log(success(`GENERATOR MODE: The output file: ${argv.dest} was sorted with successful`));
          }
        } else {
          // ERROR UNKNOWN. Need a new else if to catch why
          console.error(error('GENERATOR MODE: Unknown error detected. Please try --help or --h to resolve the problem. Otherwise, you can create a new issue on github and copy/paste the command line which generates this error'));
        }
      } else {
        // Otherwise, we haven't dest argument to write it in file
        // We will show the results only in the console
        utils.writeMD5FileDest(filesPath[0], new Set<string>(), false, false);
      }
    }

    // If we are in the compare mode
    if (argv.source && argv.compare) {
      utils.compareMD5(argv.source, argv.compare);
    }
    // ----------------
    // --- END ALGO ---
    // ----------------
  })();
};
