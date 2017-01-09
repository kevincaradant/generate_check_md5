// -----------------
// --- FUNCTIONS ---
// -----------------
const md5File = require('md5-file');
import * as fs from 'fs';
const LineByLineReader = require('line-by-line');
import * as clc from 'cli-color';
import * as checks from './checks';
const recursive = require('recursive-readdir');

const error: any = clc.red.bold;
const success: any = clc.green.bold;
const notice: any = clc.blue.bold;

// A simple method to read line by line a file
export const readFile = async (pFile: string): Promise<Array<string>> => {
  const rslt: boolean = await Promise.resolve(checks.isSourceCorrect(pFile));
  if (!rslt) {
    console.log(error('\nreadFile(pFile): pFile => pFile is wrong'));
    return new Promise<Array<string>>(resolve => resolve([]));
  }

  const lineByLineReader: any = new LineByLineReader(pFile);
  const pArrayResults: Array<string> = [];

  return new Promise<Array<string>>((resolve, reject) => {
    lineByLineReader.on('error', (err: string) => {
      console.log(error(err));
      reject(err);
    });

    lineByLineReader.on('line', (line: string) => {
      pArrayResults.push(line);
    });

    lineByLineReader.on('end', () => {
      resolve(pArrayResults);
    });
  });
};

// For each line of a the pMapCompare. We check if the content is included in the pMapSource.
export const checkMD5 = (pMapSource: Map<string, string>, pMapCompare: Map<string, string>) => {
  const getFiles = new Set([...pMapCompare].filter(line => {
    return !pMapSource.has(line[0]);
  }));

  if (getFiles.size === 0) {
    console.log(success('\nCOMPARATOR MODE: No error MD5 detected'));
  } else {
    getFiles.forEach(line => {
      console.log(error('\nCOMPARATOR MODE: Error with the MD5 line: ') + notice(line[0] + ' : ' + line[1]));
    });
  }

  return true;
};

// Analyse and get each md5 line by line for the two files ( pSource and pCompare )
export const compareMD5 = async (pFileSource: string, pFileCompare: string) => {
  const mapSource = new Map<string, string>();
  const mapCompare = new Map<string, string>();

  const rslts = await Promise.all([readFile(pFileSource), readFile(pFileCompare)]);
  rslts[0].map(line => mapSource.set(line.split(' : ')[1], line.split(' : ')[0]));
  rslts[1].map(line => mapCompare.set(line.split(' : ')[1], line.split(' : ')[0]));

  checkMD5(mapSource, mapCompare);
  return true;
};

// Build an array with only the new files which are not present in the md5 file (--dest)
export const analyseMD5 = async (pFileSource: string, pFilesPath: Array<string>, pArgvNoSpace: string) => {
  const mapSourceNameFiles = new Map<string, string>();
  const setPathAfterTransform = new Set<string>();

  pFilesPath.map(line => setPathAfterTransform.add(line.split(' ').join('_')));
  return new Promise(resolve => {
    readFile(pFileSource).then(data => {
      let getNewFilesToAddSet = new Set<string>();
      let getFilesToRemoveSet = new Set<string>();

      if (process.platform === 'win32') {
        data.map(line => mapSourceNameFiles.set((line.split(' : ')[1]).split('/').join('\\'), line.split(' : ')[0]));
      } else {
        data.map(line => mapSourceNameFiles.set((line.split(' : ')[1]).split('\\').join('/'), line.split(' : ')[0]));
      }

      const keys = Array.from(mapSourceNameFiles.keys());

      if (pArgvNoSpace) {
        getNewFilesToAddSet = new Set([...pFilesPath].filter(line => {
          return !mapSourceNameFiles.has(line.split(' ').join('_'));
        }));
        getFilesToRemoveSet = new Set(keys.filter(line => {
          return !setPathAfterTransform.has(line);
        }));
      } else {
        getNewFilesToAddSet = new Set([...pFilesPath].filter(line => {
          return !mapSourceNameFiles.has(line);
        }));

        getFilesToRemoveSet = new Set([...keys].filter(line => {
          return !new Set([...pFilesPath]).has(line);
        }));
      }
      return resolve({ getNewFilesToAddSet, getFilesToRemoveSet });
    });
  });
};

// Useful to remove / and write again a file
export const quickDumpMD5FileDest = async (pFiles: Array<string>, pArgvDest: string): Promise<boolean> => {
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
export const naturalCompare = (a: string, b: string) => {
  const ax: Array<any> = [];
  const bx: Array<any> = [];

  a.replace(/(\d+)|(\D+)/g, (_, $1, $2): any => {
    ax.push([$1 || Infinity, $2 || '']);
  });

  b.replace(/(\d+)|(\D+)/g, (_, $1, $2): any => {
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
export const sortFileDest = async (pFile: string): Promise<Array<string>> => {
  const rslt = await Promise.resolve(checks.isSourceCorrect(pFile));
  if (!rslt) {
    console.log(error('\nsortFileDest(pFile) : pFile => pFile is wrong'));
    return new Promise<Array<string>>(resolve => resolve([]));
  }

  return new Promise<Array<string>>(async resolve => {
    let rsltsReadFile = await readFile(pFile);
    rsltsReadFile = rsltsReadFile.map(line => line.split(' : ')).sort((e1, e2) => naturalCompare(e1[1], e2[1])).map(l => l.join(' : '));
    return resolve(rsltsReadFile);
  });
};

export const recursiveFolders = (pArgvPath: Array<string>): Promise<Array<string>> => {
  return new Promise(async resolve => {
    const rslts = await Promise.all(pArgvPath.map(file => {
      return new Promise(resolve => {
        recursive(file, { forceContinue: true }, (err: any, files: Array<string>) => {
          if (err) {
            console.log(error(err));
            console.log('\nError ignored..., the analyze is continuing');
          }

          if (!files) {
            resolve([]);
            return;
          }

          resolve(files);
        });
      });
    }));
    return resolve([].concat.apply([], rslts));
  });
};

// Write in a file or in a console, all the MD5 results
export const writeMD5FileDest = (pFilesToAdd: Map<string, string>, pFilesToRemove: Map<string, string>, pArgvDest: string, pArgvUpdate: string, pArgvRewrite: string, pArgvNoSpace: string) => {

  // If we want to rewrite completely the file. Delete and create again it.
  if (pArgvDest && fs.existsSync(pArgvDest) && pArgvRewrite) {
    fs.unlinkSync(pArgvDest);
  }

  // If we want update the file, we create always a backup .bak of the --dest path
  if (pArgvDest && fs.existsSync(pArgvDest) && !pArgvRewrite) {
    try {
      fs.writeFileSync(pArgvDest + '.bak', fs.readFileSync(pArgvDest));
      console.log(success(`\nBackup of ${pArgvDest} successful!`));
    } catch (err) {
      console.log(error(err));
    }
  }

  if (pArgvDest) {
    console.log(notice(`\nGENERATOR MODE: Line to add in --dest path file:`));
    // For each files to add in dest file
    if (pFilesToAdd.size === 0) {
      console.log(notice('0 / 0'));
    }
  }

  const getValuesFilesToAdd = pFilesToAdd.keys();

  for (let i = 0; i < pFilesToAdd.size; i++) {
    console.log(notice(`${i + 1} / ${pFilesToAdd.size}`));
    let file: string = getValuesFilesToAdd.next().value;

    if (fs.existsSync(file)) {
      const md5: string = md5File.sync(file);

      // We add _ instead of space to have a pretty display in the file
      // If the argument --nospace is given
      if (pArgvNoSpace) {
        file = file.split(' ').join('_');
      }

      // We try to add lines only if the argument --dest is filled.
      if (pArgvDest) {
        fs.appendFileSync(pArgvDest, `${md5} : ${file}\n`);
      } else {
        // To have always the same syntax in the file (Windows / Linux / Mac)
        // I choosed the Linux syntax for the path
        const fileGeneric = file.split('\\').join('/');
        console.log(notice(`${md5} : ${fileGeneric} \n`));
      }
    } else {
      console.log(error(`\nGENERATOR MODE: The file "${file}" can't be read. Be sure it exists.`));
    }
  }

  if (pArgvDest) {
    console.log(notice(`\nGENERATOR MODE: Line to remove from --dest path file:`));

    if (pFilesToRemove.size === 0) {
      console.log(notice('0 / 0'));
    }

    const getValuesFilesToRemove = pFilesToRemove.keys();

    // For each files to add in dest file
    for (let i = 0; i < pFilesToRemove.size; i++) {
      console.log(notice(`${i + 1} / ${pFilesToRemove.size}`));
      const file = getValuesFilesToRemove.next().value;
      const fileWin = file.split('/').join('\\');
      const fileUnix = file.split('\\').join('/');
      const body = fs.readFileSync(pArgvDest).toString();
      // 36 is to have the line including the hash of the line and not only the name of the file
      // Try under the Unix format
      const idxUnix = (body.indexOf(fileUnix)) - 35;
      if (idxUnix > -1) {
        const output = body.substr(0, idxUnix) + body.substr(idxUnix + fileUnix.length + 36);
        fs.writeFileSync(pArgvDest, output);
      }

      // 36 is to have the line including the hash of the line and not only the name of the file
      // Try under the Windows format
      const idxWin = (body.indexOf(fileWin)) - 35;
      if (idxWin > -1) {
        const output = body.substr(0, idxWin) + body.substr(idxWin + fileWin.length + 36);
        fs.writeFileSync(pArgvDest, output);
      }
    }
  }

  console.log(success('\nGENERATOR MODE: Done !'));
  return true;
};

// ---------------------
// --- END FUNCTIONS ---
// ---------------------
