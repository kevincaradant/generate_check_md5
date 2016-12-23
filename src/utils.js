// -----------------
// --- FUNCTIONS ---
// -----------------
require('babel-core/register');
require('babel-polyfill');
const md5File = require('md5-file');
const fs = require('fs');
const LineByLineReader = require('line-by-line');
const clc = require('cli-color');
const checks = require('./checks.js');

const error = clc.red.bold;
const success = clc.green.bold;
const notice = clc.blue.bold;

// A simple method to read line by line a file
const readFile = pFile => {
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
    return false;
  }

  let stateErrorMD5 = 0;
  let cptErrorMD5 = 0;

  /* eslint array-callback-return: 0 */
  pArrayCompare.map(md5 => {
    stateErrorMD5 = pArraySource.includes(md5) ? 0 : 1;
    if (stateErrorMD5) {
      console.log(error(`Error with: ${md5}`));
      cptErrorMD5++;
    }
  });

  if (!cptErrorMD5) {
    console.log(success('No error MD5 detected'));
  }

  return true;
};

// Analyse and get each md5 line by line for the two files ( pSource and pCompare )
const compareMD5 = async (pFileSource, pFileCompare) => {
  const rslts = await Promise.all([checks.isSourceCorrect(pFileSource), checks.isCompareCorrect(pFileCompare)]);

  if (rslts.includes(false)) {
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
  const rslt = Promise.resolve(checks.isSourceCorrect(pFileSource));
  rslt.then(data => {
    if (!data || !Array.isArray(pFilesPath)) {
      return false;
    }
  });

  return new Promise(resolve => {
    readFile(pFileSource).then(data => {
      let getNewFilesToAddArray = [];
      let getFilesToRemoveArray = [];
      const sourceArrayNameFiles = data.map(line => line.split(' : ')[1]);
      if (pArgvNoSpace) {
        getNewFilesToAddArray = pFilesPath.filter(line => !sourceArrayNameFiles.includes(line.split(' ').join('_')));
        getFilesToRemoveArray = sourceArrayNameFiles.filter(line => !pFilesPath.includes(line.split(' ').join('_')));
      } else {
        getNewFilesToAddArray = pFilesPath.filter(line => !sourceArrayNameFiles.includes(line));
        getFilesToRemoveArray = sourceArrayNameFiles.filter(line => !pFilesPath.includes(line));
      }
      resolve({getNewFilesToAddArray, getFilesToRemoveArray});
    });
  });
};

// Useful to remove / and write again a file
const quickDumpMD5FileDest = (files, pArgvDest) => {
  if (pArgvDest && fs.existsSync(pArgvDest)) {
    fs.unlinkSync(pArgvDest);
    files.forEach(file => {
      fs.appendFileSync(pArgvDest, `${file}\n`);
    });
  } else {
    console.log(error(`Error to find the file "--dest" at: ${pArgvDest}`));
  }
};

// Custom Sort to order by ASC
const sortFileDest = (pFile, pArgvDest) => {
  readFile(pFile).then(data => {
    const sourceArray = data.map(line => line.split(' : ')).sort((e1, e2) => e1[1] > e2[1]).map(l => l.join(' : '));

    // Read an array and  Write it directly in a file
    quickDumpMD5FileDest(sourceArray, pArgvDest);
  });
};

// Write in a file or in a console, all the MD5 results
const writeMD5FileDest = (pFilesToAdd, pFilesToRemove, pArgvDest, pArgvUpdate, pArgvRewrite, pArgvNoSpace) => {
  // If we want to rewrite completely the file. Delete and create again it.
  if (pArgvDest && fs.existsSync(pArgvDest) && !pArgvUpdate && pArgvRewrite) {
    fs.unlinkSync(pArgvDest);
  }

  console.log(notice(`\nLine to add in --dest path file:`));
  // For each files to add in dest file
  if (pFilesToAdd.length === 0) {
    console.log(notice('0 / 0'));
  }

  pFilesToAdd.forEach((file, index, arr) => {
    console.log(notice(`${index + 1} / ${arr.length}`));
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
      console.log(`${md5} : ${file} \n`);
    }
  });

  if (pArgvDest) {
    console.log(notice(`\nLine to remove from --dest path file:`));

    if (pFilesToRemove.length === 0) {
      console.log(notice('0 / 0'));
    }

    // For each files to add in dest file
    pFilesToRemove.forEach((file, index, arr) => {
      console.log(notice(`${index + 1} / ${arr.length}`));
      // We add _ instead of space to have a pretty display in the file
      // If the argument --nospace is given
      if (pArgvNoSpace) {
        file = file.split(' ').join('_');
      }

      const body = fs.readFileSync(pArgvDest).toString();
      // 36 is to have the line including the hash of the line and not only the name of the file
      const idx = (body.indexOf(file)) - 36;
      if (idx > -1) {
        const output = body.substr(0, idx) + body.substr(idx + file.length + 36);
        fs.writeFileSync(pArgvDest, output);
      }
    });
  }

  // Sort the output file in the case of an update
  if (pArgvDest && !pArgvRewrite) {
    sortFileDest(`${pArgvDest}`, pArgvDest);
  }
  console.log(success('Get every MD5 with successful !'));
};

module.exports = {
  readFile,
  compareMD5,
  analyseMD5,
  checkMD5,
  sortFileDest,
  quickDumpMD5FileDest,
  writeMD5FileDest
};

// ---------------------
// --- END FUNCTIONS ---
// ---------------------
