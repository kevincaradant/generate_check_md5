// -----------------
// --- FUNCTIONS ---
// -----------------
const md5File = require('md5-file');
import * as fs from 'fs';
const LineByLineReader = require('line-by-line');
import * as clc from 'cli-color';
const recursive = require('recursive-readdir');

const SEPARATORHASHNAME = ' : ';
const SEPARATORSPACETOCHARACTER = '_';
const error: any = clc.red.bold;
const success: any = clc.green.bold;
const notice: any = clc.blue.bold;

const isFileExist = (pType: any): boolean => {
  if (!pType) {
    return false;
  }
  return fs.existsSync(pType);
};

// A simple method to read line by line a file
export const readFile = async (pFile = ''): Promise<Array<string>> => {
  if (!pFile) {
    console.error(error('\nMethod readFile: The pFile argument is not correct.'));
    return new Promise<Array<string>>(resolve => resolve([]));
  }

  const lineByLineReader: any = new LineByLineReader(pFile);
  const pArrayResults: Array<string> = [];
  return new Promise<Array<string>>((resolve) => {
    lineByLineReader.on('error', (err: any) => {
      console.error(error(err));
      resolve(pArrayResults);
    });

    lineByLineReader.on('line', (line: any) => {
      pArrayResults.push(line);
    });

    lineByLineReader.on('end', () => {
      resolve(pArrayResults);
    });
  });
};

// For each line of a the pMapCompare. We check if the content is included in the pMapSource.
export const _isPresentMD5FromCompareToSource = (pMapSource: Map<string, string>, pMapCompare: Map<string, string>): boolean => {
  let cptCheck = 0;
  pMapCompare.forEach((name: string, md5: string) => {
    if (!pMapSource.has(md5)) {
      console.error(error('\nCOMPARATOR MODE: Error with the MD5 line: ') + notice(md5 + SEPARATORHASHNAME + name));
      cptCheck++;
    }
  });

  if (cptCheck === 0) {
    console.log(success('\nCOMPARATOR MODE: No error MD5 detected'));
  }

  return true;
};

// Analyze and get each md5 line by line for the two files ( pSource and pCompare )
export const compareMD5 = async (pFileSource = '', pFileCompare = '') => {
  const mapSource = new Map<string, string>();
  const mapCompare = new Map<string, string>();

  const rslts = await Promise.all([readFile(pFileSource), readFile(pFileCompare)]);
  rslts[0].map(line => {
    const [name, md5 = ''] = line.split(SEPARATORHASHNAME);
    mapSource.set(name, md5);
  });
  rslts[1].map(line => {
    const [name, md5 = ''] = line.split(SEPARATORHASHNAME);
    mapCompare.set(name, md5);
  });
  _isPresentMD5FromCompareToSource(mapSource, mapCompare);
  return true;
};

// Build the map with all path available in the --dest file
export const _buildDataGetFilesFromSource = (pLinesFileSource: Array<string>): Map<string, string> => {
  let namePathSplit = '';
  let mapSourceNameFiles: Map<string, string> = new Map<string, string>();

  pLinesFileSource.map(line => {
    const [md5, name = ''] = line.split(SEPARATORHASHNAME);
    if (process.platform === 'win32') {
      namePathSplit = name.split('/').join('\\');
    } else {
      namePathSplit = name.split('\\').join('/');
    }

    if (namePathSplit && md5) {
      mapSourceNameFiles.set(namePathSplit, md5);
    } else {
      console.error(error(`Error of parsing skipped with the line: ${line}`));
    }
  });
  return mapSourceNameFiles;
};

// Build an array with only the new files which are not present in the md5 file (--dest)
// Remove also the lines which are not included in the --path but present in the --dest file
export const updateMD5 = async (pFileSource: string, pFilesPath: Set<string>, pArgvNoSpace = false) => {
  let mapSourceNameFiles = new Map<string, string>();
  const setPathAfterTransform = new Set<string>();

  pFilesPath.forEach(line => setPathAfterTransform.add(line.split(' ').join(SEPARATORSPACETOCHARACTER)));
  return new Promise(resolve => {
    readFile(pFileSource).then(data => {
      let getNewFilesToAdd = new Set<string>();
      let getFilesToRemove = new Set<string>();

      mapSourceNameFiles = _buildDataGetFilesFromSource(data);

      const keysSNF = Array.from(mapSourceNameFiles.keys());
      const keysFP = Array.from(pFilesPath.keys());

      if (pArgvNoSpace) {
        getNewFilesToAdd = new Set([...keysFP].filter(line => {
          return !mapSourceNameFiles.has(line.split(' ').join(SEPARATORSPACETOCHARACTER));
        }));

        getFilesToRemove = new Set(keysSNF.filter(line => {
          return !setPathAfterTransform.has(line);
        }));
      } else {
        getNewFilesToAdd = new Set([...keysFP].filter(line => {
          return !mapSourceNameFiles.has(line);
        }));

        getFilesToRemove = new Set([...keysSNF].filter(line => {
          return !pFilesPath.has(line);
        }));
      }
      return resolve({ getNewFilesToAdd, getFilesToRemove });
    });
  });
};

// Useful to remove / and write again a file
export const quickDumpMD5FileDest = (pFiles: Array<string>, pArgvDest = ''): boolean => {
  if (isFileExist(pArgvDest)) {
    fs.unlinkSync(pArgvDest);
    pFiles.forEach(file => {
      fs.appendFileSync(pArgvDest, `${file}\n`);
    });
    return true;
  }
  console.error(error(`GENERATOR MODE: Error to find the file "--dest" at: ${pArgvDest}`));
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
export const sortFileDest = async (pFile = ''): Promise<Array<string>> => {
  return new Promise<Array<string>>(async resolve => {
    let rsltsReadFile: Array<string> = await readFile(pFile);
    rsltsReadFile = rsltsReadFile.map(line => line.split(SEPARATORHASHNAME)).sort((e1, e2) => naturalCompare(e1[1], e2[1])).map(l => l.join(SEPARATORHASHNAME));
    return resolve(rsltsReadFile);
  });
};

// Get all files in the folders and returnded it with a Set
export const recursiveFolders = (pArgvPath: Array<string>): Promise<Array<Set<string>>> => {
  return new Promise(async resolve => {
    const rslts: Array<Set<string>> = await Promise.all<any>(pArgvPath.map(file => {
      return new Promise(resolve2 => {
        recursive(file, { forceContinue: true }, (err: any, files: Array<string>) => {
          if (err) {
            console.error(error(err));
            console.log(notice('\nError ignored..., the analyze is continuing'));
          }

          if (!files) {
            resolve2(new Set<string>());
            return;
          }
          resolve2(new Set<string>(files));
        });
      });
    }));
    return resolve(rslts);
  });
};

// Get all path with md5 which have to be add in the dest file
export const _getFilesToAdd = (pFilesToAdd: Set<string>, pArgvDest = '', pArgvNoSpace = false): boolean => {
  if (pArgvDest) {
    console.log(notice(`\nGENERATOR MODE: Line to add in --dest path file:`));
    if (pFilesToAdd.size === 0) {
      console.log(notice('0 / 0'));
    }
  }
  if (pFilesToAdd.size > 0) {
    const getValuesFilesToAdd = pFilesToAdd.keys();

    for (let i = 0; i < pFilesToAdd.size; i++) {
      console.log(notice(`${i + 1} / ${pFilesToAdd.size}`));
      let file: string = getValuesFilesToAdd.next().value;
      if (isFileExist(file)) {
        const md5: string = md5File.sync(file);

        // We add SEPARATORSPACETOCHARACTER instead of space to have a pretty display in the file if the argument --nospace is given
        if (pArgvNoSpace) {
          file = file.split(' ').join(SEPARATORSPACETOCHARACTER);
        }

        // We try to add lines only if the argument --dest is filled.
        if (pArgvDest) {
          fs.appendFileSync(pArgvDest, `${md5}${SEPARATORHASHNAME}${file}\n`);
        } else {
          // To have always the same syntax in the file (Windows / Linux / Mac)
          // I choosed the Linux syntax for the path
          const fileGeneric = file.split('\\').join('/');
          console.log(notice(`${md5}${SEPARATORHASHNAME}${fileGeneric} \n`));
        }
      } else {
        console.error(error(`\nGENERATOR MODE: The file "${file}" can't be read. Be sure it exists.`));
      }
    }
  }

  return true;
};

// Get all path with md5 which have to be remove from the dest file because some paths doesn't exist anymore
export const _getFilesToRemove = (pFilesToRemove: Set<string>, pArgvDest = ''): boolean => {
  if (pArgvDest) {
    console.log(notice(`\nGENERATOR MODE: Line to remove from --dest path file:`));

    if (pFilesToRemove.size === 0) {
      console.log(notice('0 / 0'));
    }

    const getValuesFilesToRemove = pFilesToRemove.keys();

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

  return true;
};



// Write in a file or in a console, all the MD5 results
export const writeMD5FileDest = (pFilesToAdd: Set<string>, pFilesToRemove: Set<string>, pArgvRewrite = false, pArgvNoSpace = false, pArgvDest = '') => {
  // If we want to rewrite completely the file. Delete and create again it.
  if (pArgvDest && isFileExist(pArgvDest) && pArgvRewrite) {
    fs.unlinkSync(pArgvDest);
  }

  // If we want update the file, we create always a backup .bak of the --dest path
  if (pArgvDest && isFileExist(pArgvDest) && !pArgvRewrite) {
    try {
      fs.writeFileSync(pArgvDest + '.bak', fs.readFileSync(pArgvDest));
      console.log(success(`\nBackup of ${pArgvDest} successful!`));
    } catch (err) {
      console.error(error(err));
    }
  }

  _getFilesToAdd(pFilesToAdd, pArgvDest, pArgvNoSpace);
  _getFilesToRemove(pFilesToRemove, pArgvDest);

  console.log(success('\nGENERATOR MODE: Done !'));
  return true;
};

// ---------------------
// --- END FUNCTIONS ---
// ---------------------
