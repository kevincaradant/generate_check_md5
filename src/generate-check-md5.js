// ----------------------------
// --- CONST AND GLOBAL VAR ---
// ----------------------------

const checks = require('./checks.js');
const utils = require('./utils.js');
const argv = require('yargs').argv;
const fs = require('fs');
const recursiveReadSync = require('recursive-readdir-sync');
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
    'update'
  ];

  const argumentsSendByUser = Object.keys(argv).filter(obj => obj !== '$0' && obj !== '_');

  // ----------------------------
  // --- CONST AND GLOBAL VAR ---
  // ----------------------------

  // ------------------
  // -----  CHECKS ----
  // ------------------

  (async function () {
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

    /* eslint array-callback-return: 0 */
    if ((!argv.source && !argv.compare && argv.source !== '' && argv.compare !== '')) {
      const rslts = await Promise.all([checks.isPathCorrect(argv.path), checks.showPathError(argv.path), checks.isDestCorrect(argv.dest), checks.showDestError(argv.dest)]);
      rslts.map(r => {
        if (!r) {
          process.exit(0);
        }
      });
    } else {
      const rslts = await Promise.all([checks.isSourceCorrect(argv.source), checks.showSourceError(argv.source), checks.isCompareCorrect(argv.compare), checks.showCompareError(argv.compare)]);
      rslts.map(r => {
        if (!r) {
          process.exit(0);
        }
      });
    }

    // ------------------
    // --- END CHECKS ---
    // ------------------

    // ------------
    // --- ALGO ---
    // ------------
    // IF we have the --path argument
    if (argv.path) {
      try {
        // Get all files including in --path argument
        const filesPath = recursiveReadSync(argv.path);
        console.log(notice(`${filesPath.length} file${filesPath.length > 1 ? 's' : ''} detected.`));

        // If we have a file to write the results
        if (argv.dest) {
          // If we haven't any argument or --update argument and the file with --dest path is already existing
          if (!argv.rewrite && fs.existsSync(argv.dest)) {
            // We analyze to count the difference between the --path and --dest path
            utils.analyseMD5(argv.dest, filesPath).then(data => {
              const elementsToUpdate = data;
              console.log(warn(`Following file: ${argv.dest} alreading existing`));

              if (elementsToUpdate.getNewFilesToAddArray.length === 0 && elementsToUpdate.getFilesToRemoveArray.length === 0) {
                console.log(success('No difference detected between the --path and --dest arguments'));
              } else {
                console.log(success(`${elementsToUpdate.getNewFilesToAddArray.length + elementsToUpdate.getFilesToRemoveArray.length} difference detected between the data gave via --path and --dest arguments`));
                utils.writeMD5FileDest(elementsToUpdate.getNewFilesToAddArray, elementsToUpdate.getFilesToRemoveArray, argv.dest, argv.update, argv.rewrite, argv.nospace);
              }
            });
            // Otherwise if we have a --dest path but the file doesn't exist yet or we have the --rewrite argument
          } else if (!fs.existsSync(argv.dest) || argv.rewrite) {
          // We search and write all MD5 hash in a file or a console
            utils.writeMD5FileDest(filesPath, null, argv.dest, argv.update, argv.rewrite, argv.nospace);
          } else {
            // ERROR UNKNOWN. Need a new else if to catch why
            console.log(error('Error unknown detected. Please try --help or --h to resolve the problem'));
          }
        } else {
          // Otherwise, we haven't dest argument to write it in file
          // We will show the results only in the console
          utils.writeMD5FileDest(filesPath, null, argv.dest, argv.update, argv.rewrite, argv.nospace);
        }
      } catch (err) {
        console.log(error(err));
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
