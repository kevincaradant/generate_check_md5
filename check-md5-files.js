// ----------------------------
// --- CONST AND GLOBAL VAR ---
// ----------------------------

const path = require('path');
const md5File  = require('md5-file');
const argv = require('yargs').argv;
const fs = require('fs');
const LineByLineReader = require('line-by-line');
var recursiveReadSync = require('recursive-readdir-sync'), files;

const argumentsAllowedArray = [
	'path',
	'nospace',
	'dest',
	'source',
	'compare',
	'rewrite',
	'update'
];

const argumentsSendByUser = Object.keys(argv).filter(obj => obj != '$0' && obj != '_');
// -----------------
// --- END CONST ---
// -----------------


// -----------------
// --- FUNCTIONS ---
// -----------------

/**
* @description determine if an array contains one or more items from another array.
* @param {array} haystack the array to search.
* @param {array} arr the array providing items to check for in the haystack.
* @return {boolean} true|false if haystack contains at least one item from arr.
*/
const findElemInArray = function (haystack, arr) {
	return arr.every(function (v) {
		return haystack.indexOf(v) >= 0;
	});
};

const readFile = (pFile) => {
	let lineByLineReader = new LineByLineReader(pFile);
	let pArrayResults = [];

	return new Promise((resolve, reject) => {
		lineByLineReader.on('error', function (err) {
			console.log(err);
			reject(err);
		});

		lineByLineReader.on('line', function (line) {
			pArrayResults.push(line);
		});

		lineByLineReader.on('end', function () {
			resolve(pArrayResults);
		});
	})
};

// Analyse and get each md5 line by line for the two files ( pSource and pCompare )
const compareMD5 = (pFileSource, pFileCompare) => {
	readFile(pFileSource).then((data) => {
		let sourceArray = data.map(line => line.split(' : ')[0]);

		readFile(pFileCompare).then((data) => {
			let compareArray = data.map(line => line.split(' : ')[0]);
			checkMD5(sourceArray, compareArray);
		});
	});
};

// Build an array with only the new files which are not present in the md5 file (--dest)
const analyseMD5 = (pFileSource, pFilesPath) => {
	return new Promise((resolve, reject) => {
		readFile(pFileSource).then((data) => {
			let getNewFilesToAddArray = [];
			let sourceArrayNameFiles = data.map(line => line.split(' : ')[1]);
			if(!argv.nospace) {
				getNewFilesToAddArray = pFilesPath.filter(line => !sourceArrayNameFiles.includes(line));
			}else {
				getNewFilesToAddArray = pFilesPath.filter(line => !sourceArrayNameFiles.includes(line.split(' ').join('_')));
			}
			resolve(getNewFilesToAddArray);
		});
	});
};

const checkMD5 = (pSourceArray, pCompareArray) => {
	let stateErrorMD5 = 0;
	let cptErrorMD5 = 0;

	// For each lines in the compare file. We check if the md5 is the same that the other file.
	pCompareArray.map(md5 => {
		stateErrorMD5 = !pSourceArray.includes(md5) ? 1 : 0;
		if(stateErrorMD5) {
			console.log(`Error with: ${md5}`);
			cptErrorMD5++;
		}
	});

	if(!cptErrorMD5) {
		console.log("No error MD5 detected");
	}
}

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
	--rewrite`
}

// Custom Sort to order by ASC
const sortFileDest = (pFile) => {
	readFile(pFile).then((data) => {
		sourceArray = data.map(line => line.split(' : ')).sort((e1, e2) => e1[1] > e2[1]).map(l => l.join(' : '));

		// Read an array and  Write it directly in a file
		quickDumpMD5FileDest(sourceArray);
	});
}

// Useful to remove / and write again a file
const quickDumpMD5FileDest = (files) => {
	if(argv.dest && fs.existsSync(argv.dest)) {
		fs.unlinkSync(argv.dest);
		files.forEach((file, index, arr) => {
			fs.appendFileSync(argv.dest, `${file}\n`);
		});
	}else {
		console.log(`Error to find the file "--dest" at: ${argv.dest}`);
	}
}

const writeMD5FileDest = (files) => {
	// If we want to rewrite completely the file. Delete and create again it.
	if (argv.dest && fs.existsSync(argv.dest) && !argv.update && argv.rewrite) {
		fs.unlinkSync(argv.dest);
	}

	// For each PATH of file
	files.forEach((file, index, arr) => {
		console.log(`${index+1} / ${arr.length}`);
		let md5 = md5File.sync(file);

		// We add _ instead of space to have a pretty display in the file
		// If the argument --nospace is given
		if(argv.nospace) {
			file = file.split(' ').join('_');
		}

		// We try to add lines only if the argument --dest is filled.
		if(argv.dest) {
			fs.appendFileSync(argv.dest, `${md5} : ${file}\n`);
		} else {
			console.log(`${md5} : ${file} \n`);
		}
	});

	// Sort the output file in the case of an update
	if (argv.dest && !argv.rewrite) {
		sortFileDest(`${argv.dest}`);
	}

	console.log("Get every MD5 with successful !");
}

// ---------------------
// --- END FUNCTIONS ---
// ---------------------




// --------------
// --- CHECKS ---
// --------------
if(argv.h || argv.help) {
	console.log(showHelp());
	return;
}

// If the user doesn't use right parameters
if(!findElemInArray(argumentsAllowedArray, argumentsSendByUser)) {
	console.log('You doesn\'t use allowed params.\nDo -h or -help for more informations');
	return;
}

// If we haven't any arguments
if(!argv.source && !argv.compare && !argv.path && !argv.dest) {
	console.log('You should pass the arguments to use this module');
	return;
}

// If we aren't in the comparaison mode
if(!argv.source && !argv.compare) {
	// If we pass --path without string value
	if(argv.path && typeof argv.path !== 'string') {
		console.log('Use --path "your/path/and/your-folder-name".');
		return;
	} else if (!argv.path) {
		// If we don't pass --path  argument
		console.log('You should give the path of a folder to analyze by using --path "your/path/and/your-folder-name".');
	} else {
		// The argument --path is OK here
		// We check --dest now
		// If we pass --dest without string value
		if(argv.dest && typeof argv.dest !== 'string') {
			console.log('Use: --dest "your/path/and/your-file.txt".\n');
			return;
		}else if(!argv.dest) {
			// If we don't pass --dest  argument
			console.log('You should give the destination path to write the results in a file. Use: --dest "your/path/and/your-file.txt".');
			console.log('In the moment, the results will be only show in the console.\n');
		}
	}
}else{
	// At least one on two items to compare is written
	// We check firstly if --source is correct
	if(argv.source && typeof argv.source !== 'string') {
		console.log('Use: --source "your/path/and/your-source-file.txt".');
		return;
	} else if (!argv.source) {
		console.log('You should give the source path which allow to compare the md5 with the compare path. Use: --source "your/path/and/your-source-file.txt".');
		return;
	}

	if(argv.compare && typeof argv.compare !== 'string') {
		// We check if --compare is correct
		console.log('Use: --compare "your/path/and/your-compare-file.txt".');
		return;
	} else if (!argv.compare) {
		console.log('You should give the compare path which will be compared with the source path. Use: --compare "your/path/and/your-compare-file.txt".');
		return;
	}
}

// ------------------
// --- END CHECKS ---
// ------------------


// ------------
// --- ALGO ---
// ------------

// IF WE HAVE THE PATH argument
if (argv.path) {
	try {
		// Get all files including in argv.path
		filesPath = recursiveReadSync(argv.path);
		console.log(`${filesPath.length} file${filesPath.length > 1 ? 's' : ''} detected.`);

		// If we have a file to write the results
		if (argv.dest) {
			if(((!argv.rewrite && !argv.update) || (!argv.rewrite && argv.update)) && (fs.existsSync(argv.dest))) {
				analyseMD5(argv.dest, filesPath).then((data) => {
					let elementsToUpdate = data;
					console.log(`Following file: ${argv.dest} alreading existing`);

					if(elementsToUpdate.length == 0) {
						console.log('No difference detected between the --path and --dest arguments');
					} else {
						console.log(`${elementsToUpdate.length} difference detected between the data gave via --path and --dest arguments`);
						writeMD5FileDest(elementsToUpdate);
					}
				});
			} else if ((argv.rewrite && !argv.update) || (!argv.rewrite && !argv.update && !fs.existsSync(argv.dest))) {
				writeMD5FileDest(filesPath);
			} else if (argv.rewrite && argv.update) {
				console.log('You can\'t give the --rewrite and --update in the same time. Try --help to have more informations');
			} else {
				console.log('Error unknow')
			}
		}else{
			// Else, we haven't dest argument to write it in file
			// We wil show the results only in the console
			writeMD5FileDest(filesPath);
		}
	} catch(err) {
		console.log(err);
	}
}

// If we are in the compare mode
if (argv.source || argv.compare) {
	compareMD5(argv.source, argv.compare);
}

// ----------------
// --- END ALGO ---
// ----------------
