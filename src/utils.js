// -----------------
// --- FUNCTIONS ---
// -----------------
const md5File = require('md5-file');
const fs = require('fs');
const LineByLineReader = require('line-by-line');
const clc = require('cli-color');

const error = clc.red.bold;
const success = clc.green.bold;
const notice = clc.blue.bold;

const findElemInArray = (pHaystack, pArr) => {
  return pArr.every(v => {
    return pHaystack.indexOf(v) >= 0;
  });
};

const findAtLeastOneElemInArray = (pHaystack, pArr) => {
  return pArr.some(v => {
    return pHaystack.indexOf(v) >= 0;
  });
};

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

/* eslint array-callback-return: 0 */
const checkMD5 = (pSourceArray, pCompareArray) => {
  let stateErrorMD5 = 0;
  let cptErrorMD5 = 0;

  // For each lines in the compare file. We check if the md5 is the same that the other file.
  pCompareArray.map(md5 => {
    stateErrorMD5 = pSourceArray.includes(md5) ? 0 : 1;
    if (stateErrorMD5) {
      console.log(error(`Error with: ${md5}`));
      cptErrorMD5++;
    }
  });

  if (!cptErrorMD5) {
    console.log(success('No error MD5 detected'));
  }
};

// Analyse and get each md5 line by line for the two files ( pSource and pCompare )
const compareMD5 = (pFileSource, pFileCompare) => {
  readFile(pFileSource).then(data => {
    const sourceArray = data.map(line => line.split(' : ')[0]);

    readFile(pFileCompare).then(data => {
      const compareArray = data.map(line => line.split(' : ')[0]);
      checkMD5(sourceArray, compareArray);
    });
  });
};

// Build an array with only the new files which are not present in the md5 file (--dest)
const analyseMD5 = (pFileSource, pFilesPath, pArgvNoSpace) => {
  return new Promise(resolve => {
    readFile(pFileSource).then(data => {
      let getNewFilesToAddArray = [];
      const sourceArrayNameFiles = data.map(line => line.split(' : ')[1]);
      if (pArgvNoSpace) {
        getNewFilesToAddArray = pFilesPath.filter(line => !sourceArrayNameFiles.includes(line.split(' ').join('_')));
      } else {
        getNewFilesToAddArray = pFilesPath.filter(line => !sourceArrayNameFiles.includes(line));
      }
      resolve(getNewFilesToAddArray);
    });
  });
};

const showHelp = () => {
  return `
  To generate MD5 on console (only) :
  --path "/path/to/the/my_directory_with_files/"

  To generate MD5 and write it in the file :
  --path "/path/to/the/my_directory_with_files/"
  --dest "/path/to/write/file_md5_results.txt"

  To compare md5 files :
  --source "/path/to/the/md5_file_source_its_the_reference.txt/"
  --compare "/path/to/the/md5_file_to_be_compared_with_source_file.txt/"

  To generate AND compare md5 files in the same :
  --path "/path/to/the/my_directory_with_files/"
  --dest "/path/to/write/file_md5_results.txt"
  --source "/path/to/the/md5_file_source_its_the_reference.txt/"
  --compare "/path/to/the/md5_file_to_be_compared_with_source_file.txt/"

  ------------------------------------  OPTIONAL: ------------------------------------
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

const writeMD5FileDest = (pFiles, pArgvDest, pArgvUpdate, pArgvRewrite, pArgvNoSpace) => {
  // If we want to rewrite completely the file. Delete and create again it.
  if (pArgvDest && fs.existsSync(pArgvDest) && !pArgvUpdate && pArgvRewrite) {
    fs.unlinkSync(pArgvDest);
  }

  // For each PATH of file
  pFiles.forEach((file, index, arr) => {
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

  // Sort the output file in the case of an update
  if (pArgvDest && !pArgvRewrite) {
    sortFileDest(`${pArgvDest}`, pArgvDest);
  }
  console.log(success('Get every MD5 with successful !'));
};

module.exports = {
  findElemInArray,
  findAtLeastOneElemInArray,
  readFile,
  compareMD5,
  analyseMD5,
  checkMD5,
  showHelp,
  sortFileDest,
  quickDumpMD5FileDest,
  writeMD5FileDest
};

// ---------------------
// --- END FUNCTIONS ---
// ---------------------
