// -----------------
// --- FUNCTIONS ---
// -----------------
require('babel-polyfill');

const md5File = require('md5-file');
const fs = require('fs');
const LineByLineReader = require('line-by-line');
const clc = require('cli-color');
const checks = require('./checks.js');
const recursive = require('recursive-readdir');

const error = clc.red.bold;
const success = clc.green.bold;
const notice = clc.blue.bold;

// A simple method to read line by line a file
const readFile = async pFile => {
  const rslt = await Promise.resolve(checks.isSourceCorrect(pFile));
  if (!rslt) {
    console.log(error('\nreadFile(pFile): pFile => pFile is wrong'));
    return false;
  }

  const lineByLineReader = new LineByLineReader(pFile);
  const pArrayResults = [];

  return new Promise((resolve, reject) => {
    lineByLineReader.on('error', err => {
      console.log(error(err));
      reject(err);
    });

    lineByLineReader.on('line', line => {
      pArrayResults.push(line);
    });

    lineByLineReader.on('end', () => {
      resolve(pArrayResults);
    });
  });
};

// For each line of a the pCompareArray. We check if the content is included in the pSourceArray.
const checkMD5 = (pArraySource, pArrayCompare) => {
  if (!Array.isArray(pArraySource) || !Array.isArray(pArrayCompare)) {
    console.log(error('\ncheckMD5(pArraySource, pArrayCompare) : pArraySource / pArrayCompare => Should be arrays'));
    return false;
  }

  let stateErrorMD5 = 0;
  let cptErrorMD5 = 0;

  /* eslint array-callback-return: 0 */
  pArraySource.map(md5 => {
    stateErrorMD5 = pArrayCompare.includes(md5) ? 0 : 1;
    if (stateErrorMD5) {
      console.log(error(`\nCOMPARATOR MODE: Error with the MD5 line: ${md5}`));
      cptErrorMD5++;
    }
  });

  if (!cptErrorMD5) {
    console.log(success('\nCOMPARATOR MODE: No error MD5 detected'));
  }

  return true;
};

// Analyse and get each md5 line by line for the two files ( pSource and pCompare )
const compareMD5 = async (pFileSource, pFileCompare) => {
  const rslts = await Promise.all([checks.isSourceCorrect(pFileSource), checks.isCompareCorrect(pFileCompare)]);
  if (rslts.includes(false)) {
    console.log(error('\ncompareMD5(pFileSource, pFileCompare): pFileSource /  pFileCompare => pFileSource or/and pFileCompare are wrong'));
    return false;
  }

  const rsltsReadFile = await Promise.all([readFile(pFileSource), readFile(pFileCompare)]);
  const sourceArray = rsltsReadFile[0].map(line => line.split(' : ')[0]);
  const compareArray = rsltsReadFile[1].map(line => line.split(' : ')[0]);
  checkMD5(sourceArray, compareArray);
  return true;
};

// Build an array with only the new files which are not present in the md5 file (--dest)
const analyseMD5 = async (pFileSource, pFilesPath, pArgvNoSpace) => {
  const rslt = await Promise.resolve(checks.isSourceCorrect(pFileSource));
  if (!rslt) {
    console.log(error('\nanalyseMD5(pFileSource, pFilesPath, pArgvNoSpace): pFileSource => pFileSource is wrong'));
    return false;
  } else if (!Array.isArray(pFilesPath)) {
    console.log(error('\nanalyseMD5(pFileSource, pFilesPath, pArgvNoSpace): pFilesPath => Should be an array'));
    return false;
  }

  const pFilesPathAfterTransform = pFilesPath.map(line => line.split(' ').join('_'));

  return new Promise(resolve => {
    readFile(pFileSource).then(data => {
      let getNewFilesToAddArray = [];
      let getFilesToRemoveArray = [];
      const sourceArrayNameFiles = data.map(line => line.split(' : ')[1]);
      if (pArgvNoSpace) {
        getNewFilesToAddArray = pFilesPath.filter(line => {
          if (line) {
            return !sourceArrayNameFiles.includes(line.split(' ').join('_'));
          }
        });
        getFilesToRemoveArray = sourceArrayNameFiles.filter(line => {
          if (line) {
            return !pFilesPathAfterTransform.includes(line);
          }
        });
      } else {
        getNewFilesToAddArray = pFilesPath.filter(line => {
          if (line) {
            return !sourceArrayNameFiles.includes(line);
          }
        });
        getFilesToRemoveArray = sourceArrayNameFiles.filter(line => {
          if (line) {
            return !pFilesPath.includes(line);
          }
        });
      }
      return resolve({getNewFilesToAddArray, getFilesToRemoveArray});
    });
  });
};

// Useful to remove / and write again a file
const quickDumpMD5FileDest = async (pFiles, pArgvDest) => {
  if (!Array.isArray(pFiles)) {
    console.log(error('\nquickDumpMD5FileDest(pFiles, pArgvDest): pFiles => Should be an array'));
    return false;
  }

  const rslt = await Promise.resolve(checks.isDestCorrect(pArgvDest));
  if (!rslt) {
    console.log(error('\nquickDumpMD5FileDest(pFile, pArgvDest) : pArgvDest => pArgvDest is wrong'));
    return false;
  }

  if (fs.existsSync(pArgvDest)) {
    fs.unlinkSync(pArgvDest);
    pFiles.forEach(file => {
      fs.appendFileSync(pArgvDest, `${file}\n`);
    });
    return true;
  }

  console.log(error(`GENERATOR MODE: Error to find the file "--dest" at: ${pArgvDest}`));

  return false;
};

// Order an array using the natural way
const naturalCompare = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') {
    console.log(error('\nnaturalCompare(a, b) : a/b => a or b are wrong'));
    return false;
  }

  const ax = [];
  const bx = [];

  a.replace(/(\d+)|(\D+)/g, (_, $1, $2) => {
    ax.push([$1 || Infinity, $2 || '']);
  });

  b.replace(/(\d+)|(\D+)/g, (_, $1, $2) => {
    bx.push([$1 || Infinity, $2 || '']);
  });

  while (ax.length && bx.length) {
    const an = ax.shift();
    const bn = bx.shift();
    const nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
    if (nn) {
      return nn;
    }
  }
  return ax.length - bx.length;
};

// Custom Sort to order by ASC
const sortFileDest = async pFile => {
  const rslt = await Promise.resolve(checks.isSourceCorrect(pFile));
  if (!rslt) {
    console.log(error('\nsortFileDest(pFile) : pFile => pFile is wrong'));
    return false;
  }

  return new Promise(resolve => {
    readFile(pFile).then(data => {
      const sourceArray = data.map(line => line.split(' : ')).sort((e1, e2) => naturalCompare(e1[1], e2[1])).map(l => l.join(' : '));
      return resolve(sourceArray);
    });
  });
};

const recursiveFolders = pArgvPath => {
  return new Promise(resolve => {
    recursive(pArgvPath, {forceContinue: true}, (err, files) => {
      if (err) {
        console.log(error(err));
        console.log('\nError ignored..., the analyze is continuing');
      }

      if (!files) {
        return resolve([]);
      }

      return resolve(files);
    });
  });
};

// Write in a file or in a console, all the MD5 results
const writeMD5FileDest = (pFilesToAdd, pFilesToRemove, pArgvDest, pArgvUpdate, pArgvRewrite, pArgvNoSpace) => {
  if (!Array.isArray(pFilesToAdd) || !Array.isArray(pFilesToRemove)) {
    console.log(error('\nwriteMD5FileDest(pFilesToAdd, pFilesToRemove, pArgvDest, pArgvUpdate, pArgvRewrite, pArgvNoSpace, pSort) : pFilesToAdd / pFilesToRemove => Should be arrays'));
    return false;
  }

  // If we want to rewrite completely the file. Delete and create again it.
  if (pArgvDest && fs.existsSync(pArgvDest) && pArgvRewrite) {
    fs.unlinkSync(pArgvDest);
  }

  console.log(notice(`\nGENERATOR MODE: Line to add in --dest path file:`));
  // For each files to add in dest file
  if (pFilesToAdd.length === 0) {
    console.log(notice('0 / 0'));
  }

  pFilesToAdd.forEach((file, index, arr) => {
    console.log(notice(`${index + 1} / ${arr.length}`));

    if (fs.existsSync(file)) {
      const md5 = md5File.sync(file);

      // We add _ instead of space to have a pretty display in the file
      // If the argument --nospace is given
      if (pArgvNoSpace) {
        file = file.split(' ').join('_');
      }

      // We try to add lines only if the argument --dest is filled.
      if (pArgvDest) {
        fs.appendFileSync(pArgvDest, `${md5} : ${file}\n`);
      } else {
        console.log(notice(`${md5} : ${file} \n`));
      }
    } else {
      console.log(error(`\nGENERATOR MODE: The file "${file}" can't be read. Be sure it exists.`));
    }
  });

  if (pArgvDest) {
    console.log(notice(`\nGENERATOR MODE: Line to remove from --dest path file:`));

    if (pFilesToRemove.length === 0) {
      console.log(notice('0 / 0'));
    }

    // For each files to add in dest file
    pFilesToRemove.forEach((file, index, arr) => {
      console.log(notice(`${index + 1} / ${arr.length}`));

      const body = fs.readFileSync(pArgvDest).toString();
      // 36 is to have the line including the hash of the line and not only the name of the file
      const idx = (body.indexOf(file)) - 35;
      if (idx > -1) {
        const output = body.substr(0, idx) + body.substr(idx + file.length + 36);
        fs.writeFileSync(pArgvDest, output);
      }
    });
  }

  console.log(success('\nGENERATOR MODE: Get every MD5 with successful !'));
  return true;
};

module.exports = {
  readFile,
  recursiveFolders,
  compareMD5,
  analyseMD5,
  checkMD5,
  naturalCompare,
  sortFileDest,
  quickDumpMD5FileDest,
  writeMD5FileDest
};

// ---------------------
// --- END FUNCTIONS ---
// ---------------------
