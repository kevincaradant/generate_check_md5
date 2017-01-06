// ----------------------------
// --- CONST AND GLOBAL VAR ---
// ----------------------------

const checks = require('./checks.js');
const utils = require('./utils.js');
const argv = require('yargs').array('path').argv;
const fs = require('fs');
const clc = require('cli-color');

exports.generate = () => {
  const error = clc.red.bold;
  const success = clc.green.bold;
  const warn = clc.yellow.bold;
  const notice = clc.blue.bold;

  const argumentsAllowedArray = [
    'path',
    'nospace',
    'dest',
    'source',
    'compare',
    'rewrite',
    'update',
    'sort'
  ];

  const argumentsSendByUser = Object.keys(argv).filter(obj => obj !== '$0' && obj !== '_');

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

  (async function () {
    /* eslint array-callback-return: 0 */
    if ((argv.path || argv.dest) && !argv.source && !argv.compare) {
      const rslts = await Promise.all([checks.isPathCorrect(argv.path), checks.showPathError(argv.path), checks.isDestCorrect(argv.dest), checks.showDestError(argv.dest)]);
      if (rslts.includes(false)) {
        process.exit(0);
      }
    } else if ((argv.source || argv.compare) && !argv.path && !argv.dest) {
      const rslts = await Promise.all([checks.isSourceCorrect(argv.source), checks.showSourceError(argv.source), checks.isCompareCorrect(argv.compare), checks.showCompareError(argv.compare)]);
      if (rslts.includes(false)) {
        process.exit(0);
      }
    } else {
      const rslts = await Promise.all([checks.isPathCorrect(argv.path), checks.showPathError(argv.path), checks.isDestCorrect(argv.dest), checks.showDestError(argv.dest)]);
      if (rslts.includes(false)) {
        process.exit(0);
      }
      const rslts2 = await Promise.all([checks.isSourceCorrect(argv.source), checks.showSourceError(argv.source), checks.isCompareCorrect(argv.compare), checks.showCompareError(argv.compare)]);
      if (rslts2.includes(false)) {
        process.exit(0);
      }
    }
    // ------------------
    // --- END CHECKS ---
    // ------------------

    // ------------
    // --- ALGO ---
    // ------------
    // IF we have the --path argument
    if (argv.path) {
      // Get all files including in --path argument
      // If simple string
      const filesPath = await utils.recursiveFolders(argv.path);
      console.log(notice(`\nGENERATOR MODE: ${filesPath.length} file${filesPath.length > 1 ? 's' : ''} detected.`));
      // If we have a file to write the results
      if (argv.dest) {
        // No --rewrite arg and the file with --dest path is already existing. (We can have --update arg)
        if (!argv.rewrite && fs.existsSync(argv.dest)) {
          // We analyze to count the difference between the --path and --dest path
          const differenceDetected = await Promise.resolve(utils.analyseMD5(argv.dest, filesPath, argv.nospace));
          console.log(warn(`GENERATOR MODE: Update in progress.`));
          // If we don't have any diff
          if (differenceDetected.getNewFilesToAddArray.length === 0 && differenceDetected.getFilesToRemoveArray.length === 0) {
            // Sort the output file in the case of an update
            if (argv.sort) {
              // If we want update the file, we create always a backup .bak of the --dest path
              fs.writeFileSync(argv.dest + '.bak', fs.readFileSync(argv.dest));
              console.log(success(`Backup of ${argv.dest} successful!`));
              const filesToSort = await Promise.resolve(utils.sortFileDest(`${argv.dest}`));
              utils.quickDumpMD5FileDest(filesToSort, argv.dest);
              console.log(success(`GENERATOR MODE: The output file: ${argv.dest} was sorted with successful`));
            }
            console.log(success('GENERATOR MODE: No difference detected. Already up to date.'));
          } else {
            console.log(success(`${differenceDetected.getNewFilesToAddArray.length + differenceDetected.getFilesToRemoveArray.length} difference detected between the data gave via --path and --dest arguments`));
            utils.writeMD5FileDest(differenceDetected.getNewFilesToAddArray, differenceDetected.getFilesToRemoveArray, argv.dest, argv.update, argv.rewrite, argv.nospace);
            // Sort the output file in the case where we have anything to update
            if (argv.sort) {
              const filesToSort = await Promise.resolve(utils.sortFileDest(`${argv.dest}`));
              utils.quickDumpMD5FileDest(filesToSort, argv.dest);
              console.log(success(`GENERATOR MODE: The output file: ${argv.dest} was sorted with successful`));
            }
          }
          // Otherwise if we have a --dest path but the file doesn't exist yet or we have the --rewrite argument
        } else if (argv.rewrite || !fs.existsSync(argv.dest)) {
          // We search and write all MD5 hash in a file or a console
          utils.writeMD5FileDest(filesPath, [], argv.dest, argv.update, argv.rewrite, argv.nospace);
          // Sort the output file in the case of an rewrite
          if (argv.sort) {
            const filesToSort = await Promise.resolve(utils.sortFileDest(`${argv.dest}`));
            utils.quickDumpMD5FileDest(filesToSort, argv.dest);
            console.log(success(`GENERATOR MODE: The output file: ${argv.dest} was sorted with successful`));
          }
        } else {
          // ERROR UNKNOWN. Need a new else if to catch why
          console.log(error('GENERATOR MODE: Unknown error detected. Please try --help or --h to resolve the problem. Otherwise, you can create a new issue on github and copy/paste the command line which generates this error'));
        }
      } else {
        // Otherwise, we haven't dest argument to write it in file
        // We will show the results only in the console
        console.log(filesPath);
        utils.writeMD5FileDest(filesPath, []);
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
