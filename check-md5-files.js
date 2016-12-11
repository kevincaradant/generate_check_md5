const path = require('path');
const md5File  = require('md5-file');
const argv = require('yargs').argv;
const fs = require('fs');
const LineByLineReader = require('line-by-line');

var recursiveReadSync = require('recursive-readdir-sync'), files;

// Array of MD5 after to have read each line of source file and compare file.
var sourceArray = [];
var compareArray = [];

// Analyse and get each md5 line by line for the two files ( pSource and pCompare )
const analyseMD5 = (pSource, pCompare) => {

  //----------------
  // pSource (file1)
  //----------------

  let lineByLineReader = new LineByLineReader(pSource);

  lineByLineReader.on('error', function (err) {
    console.log(err);
  });

  lineByLineReader.on('line', function (line) {
    // Get only the md5. Otherwise we could get the name of the file with it md5. Write [0] to get the name or remove it and you will have name + md5
    line = line.split(' : ')[0]
    sourceArray.push(line);
  });

  //----------------
  // pCompare (file2)
  //----------------

  let lineByLineReader2 = new LineByLineReader(pCompare);

  lineByLineReader2.on('error', function (err) {
    console.log(err)
  });

  lineByLineReader2.on('line', function (line) {
    // Get only the md5. Otherwise we could get the name of the file with it md5. Write [0] to get the name or remove it and you will have name + md5
    line = line.split(' : ')[0]
    compareArray.push(line);
  });

  // When the reading is finished. We compare both array and show when a anomaly is found
  lineByLineReader2.on('end', function () {
    containMD5(sourceArray, compareArray);
  });
};

const containMD5 = (pSourceContain, pCompareContain) => {
  let cptErrorMD5 = 0;

  // For each lines in the compare file. We check if the md5 is the same that the other file.
  for (md5 in pCompareContain) {
    if(!pSourceContain.includes(pCompareContain[md5])){
      console.log(`Error with: ${pCompareContain[md5]}`);
      cptErrorMD5 ++;
    }
  }

  if(cptErrorMD5 == 0){
    console.log("No error MD5");
  }
}


// ----------------------------------------------------------------------------------


if(argv.h || argv.help){
  console.log(`
  To generate MD5 on console (only) :
  --path "/path/to/the/my_directory_with_files/"    or    -path "/path/to/the/my_directory_with_files/"

  To generate MD5 and write it in the file :
  --path "/path/to/the/my_directory_with_files/"    or    -path "/path/to/the/my_directory_with_files/"
  --dest "/path/to/write/file_md5_results.txt"    or    -dest "/path/to/write/file_md5_results.txt/"

  To compare md5 files :
  --source "/path/to/the/md5_file_source_its_the_reference.txt/"    or    -source "/path/to/the/md5_file_source_its_the_reference.txt/"
  --compare "/path/to/the/md5_file_to_be_compared_with_source_file.txt/"    or    -compare "/path/to/the/md5_file_to_be_compared_with_source_file.txt/"

  To generate AND compare md5 files in the same :
  --path "/path/to/the/my_directory_with_files/"    or    -path "/path/to/the/my_directory_with_files/"
  --dest "/path/to/write/file_md5_results.txt"    or    -dest "/path/to/write/file_md5_results.txt/"
  --source "/path/to/the/md5_file_source_its_the_reference.txt/"    or    -source "/path/to/the/md5_file_source_its_the_reference.txt/"
  --compare "/path/to/the/md5_file_to_be_compared_with_source_file.txt/"    or    -compare "/path/to/the/md5_file_to_be_compared_with_source_file.txt/"

  To rename files name in the file of results without space :
  -- nospace or -nospace
  Example:
  Before: /Folder1/my file for example.mkv a9asd1171dd83e122598af664bd3f785)
  After: /Folder1/my_file_for_example.mkv a9asd1171dd83e122598af664bd3f785)
  `);
  return;
}

if(!argv.source && !argv.compare && !argv.path && !argv.dest){
  console.log('You should pass the arguments to use this module');
  return;
}

if(!argv.path && (!argv.source && !argv.compare) ) {
  console.log('You should give the path of a folder to analyze by using --path your/path/and/your-folder-name.');
}
else if (argv.path) {
  if(!argv.dest) {
    console.log('You should give the destination path to write the results in a file. Use: --dest your/path/and/your-file.txt.');
    console.log('In the moment, the results will be only show in the console.\n');
  }

  try {
    // Get all files including in argv.path
    files = recursiveReadSync(argv.path);
    console.log(`${files.length} file${files.length > 1 ? 's' : ''} detected.`);
    // If we have a file to write the result
    if (argv.dest) {
      // If the files doesn't exist, we pass in the catch otherwise the file is erased
      try {
        fs.unlinkSync(argv.dest);
      }
      catch(err) {
        console.log(err);
        console.log(`The file with the path ${argv.dest} can\'t be remove.`);
      }
    }

    // For each file found
    files.forEach((file, index, arr) => {
      console.log(`${index+1} / ${arr.length}`);

      // We add _ instead of space to have a pretty display in the file
      if(argv.nospace) {
        file = file.split(' ').join('_');
      }

      // If we have a file to write the result
      if (argv.dest) {
        // We wrote in the file
        fs.appendFileSync(argv.dest, `${md5File.sync(file)} : ${file}\n`);
      } else{
        // We wrote in the console only
        console.log(`${md5} : ${file} `);
      }
    });
    console.log("Get every MD5 done !");
  } catch(err){
    console.log(err);
    console.log('Path wrong for --path. No files found');
  }

}

if (argv.source || argv.compare) {
  if(!argv.source) {
    console.log('You should give the source path which allow to compare the md5 with the compare path. Use: --source your/path/and/your-source-file.txt.');
    return;
  }
  else if(!argv.compare) {
    console.log('You should give the compare path which will be compared with the source path. Use: --compare your/path/and/your-compare-file.txt.');
    return;
  }else{
    analyseMD5(argv.source, argv.compare);
  }
}


// ----------------------------------------------------------------------------------
