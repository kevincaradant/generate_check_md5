<big><h1 align="center">Generator / Comparator MD5</h1></big>

<p align="center">
  <a href="https://npmjs.org/package/generate_check_md5">
    <img src="https://img.shields.io/npm/v/generate_check_md5.svg?style=flat-square"
    alt="NPM Version">
  </a>

  <a href="https://coveralls.io/github/kevincaradant/generate_check_md5?branch=master">
    <img src="https://coveralls.io/repos/github/kevincaradant/generate_check_md5/badge.svg?branch=master"
    alt="Coverage Status">
  </a>

  <a href="https://travis-ci.org/kevincaradant/generate_check_md5">
    <img src="https://img.shields.io/travis/kevincaradant/generate_check_md5.svg?style=flat-square"
    alt="Build Status">
  </a>

  <a href="https://npmjs.org/package/generate_check_md5">
    <img src="http://img.shields.io/npm/dm/generate_check_md5.svg?style=flat-square"
    alt="Downloads">
  </a>

  <a href="https://www.bithound.io/github/kevincaradant/generate_check_md5">
    <img src="https://www.bithound.io/github/kevincaradant/generate_check_md5/badges/score.svg"
    alt="Bithound Status">
  </a>

  <a href="https://www.bithound.io/github/kevincaradant/generate_check_md5/master/dependencies/npm">
    <img src="https://www.bithound.io/github/kevincaradant/generate_check_md5/badges/devDependencies.svg"
    alt="devDependencies Status">
  </a>

  <a href="https://www.bithound.io/github/kevincaradant/generate_check_md5/master/dependencies/npm">
    <img src="https://www.bithound.io/github/kevincaradant/generate_check_md5/badges/dependencies.svg"
    alt="dependencies Status">
  </a>

  <a href="https://www.bithound.io/github/kevincaradant/generate_check_md5">
    <img src="https://www.bithound.io/github/kevincaradant/generate_check_md5/badges/code.svg"
    alt="Code Status">
  </a>

  <a href="https://github.com/kevincaradant/generate_check_md5/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/generate_check_md5.svg?style=flat-square"
    alt="License">
  </a>

  <a href="http://inch-ci.org/github/kevincaradant/generate_check_md5.svg?branch=master&style=flat-square">
    <img src="http://inch-ci.org/github/kevincaradant/generate_check_md5.svg?branch=master&style=flat-square"
    alt="Docs">
  </a>
</p>

## Description
With this generator, you can very easily create a MD5 hash on each files wanted.
Furthemore, you can compare two MD5 files and see the difference.
That's make sense, for example, if you want to compare a file which is on HARDDRIVE A and an other
file which is on HARDDRIVE B and be sure the files aren't corrupted.
Very useful in the case of the backup copy.

## Install (Production)
<h4><i>
  <a href="https://raw.githubusercontent.com/kevincaradant/generate_check_md5/master/img/warn.png">
    <img src="https://raw.githubusercontent.com/kevincaradant/generate_check_md5/master/img/warn.png"
    alt="Warn">
  </a>
  Should be installed in global
</h4></i>

```js

npm install -g generate_check_md5
```

## Usage (Production)

### How it works ? (Production)

```js
// To generate MD5 on console (only) :
gcmd5 --path "/path/to/the/my_directory_with_files/"

// To generate MD5 and write it in the file :
gcmd5 --path "/path/to/the/my_directory_with_files/" --dest "/path/to/write/file_md5_results.txt"

// To compare two md5 files :
gcmd5 --source "/path/to/the/md5_file_source_its_the_reference.txt/" --compare "/path/to/the/md5_file_to_be_compared_with_source_file.txt/"

// To generate AND compare md5 files in the same :
gcmd5 --path "/path/to/the/my_directory_with_files/" --dest "/path/to/write/file_md5_results.txt" --source "/path/to/the/md5_file_source_its_the_reference.txt/" --compare "/path/to/the/md5_file_to_be_compared_with_source_file.txt/"

//------------------------------------  OPTIONAL: ------------------------------------
// To rename files name in the file of results without space :
gcmd5 your_arguments  --nospace
// Example:
// Before: /Folder1/my file for example.mkv a9asd1171dd83e122598af664bd3f785)
// After: /Folder1/my_file_for_example.mkv a9asd1171dd83e122598af664bd3f785)

// To ask only an update between a path and your md5 files :
gcmd5 your_arguments --update
// NB: By default, if you don't specify --update or --rewrite, it's the argument --update which is selected

// To rewrite completely your md5 files got with --dest :
gcmd5 your_arguments  --rewrite
```

-----------------------------------

## Install (Development)
### Global Dependencies (Development)
| Dependency |  Version  | Install                               |
| ---------- | -------   | ------------------------------------- |
| NodeJS     | > 4.x.x   | [http://node.org](http://nodejs.org/) |
| Npm        | > 3.x.x   | [http://node.org](http://nodejs.org/) |
| Rise       | > 2.x.x   | `npm install generator-rise -g`       |
| Yarn       | > 1.x.x   | `npm install yarn -g`                 |
| Yeoman     | > 1.x.x   | `npm install yo -g`                   |
| Auto-cl    | > 3.x.x   | `npm install auto-changelog -g`       |

### Others Dependencies (Development)
#### Yarn
Tape the command: `yarn`

#### Npm
Tape the command: `npm install`


## Usage (Development)
### Tasks
- `$ npm run start`: Like `npm run dev`
- `$ npm run clean`: Remove the dist and coverage folders
- `$ npm run lint`: Apply a ESlinter ( xo config ) on the src and tests folders
- `$ npm run check`: Aply the linter and check if the dependencies required in js files is also present in the package.json
- `$ npm run watch`: Compile again the tests and the dist folder after any change
- `$ npm run test`: Execute once all the tests available
- `$ npm run build`: Compile all src files with babel and get the dist output folder
- `$ npm run postbuild`: Execute `npm run check` and `npm run test` after to have execute `npm run build`
- `$ npm run coverage`: Execute the coverage of the code and show the results in the coverage folder
- `$ npm run coveralls`: Execute `npm run coverage` and create the data of the code for coveralls
- `$ npm run postcoveralls`: Remove the coverage folder after execute `npm run coveralls`
- `$ npm run prepublish`: Execute the build before to execute `npm run publish` if `npm run publish` was called
- `$ npm run deploy`: Execute a pull / rebase and push on github (origin master)
- `$ npm run patch`: Create a tag 0.0.X and publish the npm module
- `$ npm run minor`: Create a tag 0.X.0 and publish the npm module
- `$ npm run major`: Create a tag X.0.0 and publish the npm module
- `$ npm run postpublish`: After to call `npm run publish`, We push the new tag on the github (origin master)
- `$ npm run autocl`: Generate a Changelog file using the commits on github

### How it works ? (Develoment)

1- Go in the bin folder.

2- Choose one of these commands:

```js
// To generate MD5 on console (only) :
node index.js --path "/path/to/the/my_directory_with_files/"

// To generate MD5 and write it in the file :
node index.js --path "/path/to/the/my_directory_with_files/" --dest "/path/to/write/file_md5_results.txt"

// To compare two md5 files :
node index.js --source "/path/to/the/md5_file_source_its_the_reference.txt/" --compare "/path/to/the/md5_file_to_be_compared_with_source_file.txt/"

// To generate AND compare md5 files in the same :
node index.js --path "/path/to/the/my_directory_with_files/" --dest "/path/to/write/file_md5_results.txt" --source "/path/to/the/md5_file_source_its_the_reference.txt/" --compare "/path/to/the/md5_file_to_be_compared_with_source_file.txt/"

//------------------------------------  OPTIONAL: ------------------------------------
// To rename files name in the file of results without space :
node index.js your_arguments  --nospace
// Example:
// Before: /Folder1/my file for example.mkv a9asd1171dd83e122598af664bd3f785)
// After: /Folder1/my_file_for_example.mkv a9asd1171dd83e122598af664bd3f785)

// To ask only an update between a path and your md5 files :
node index.js your_arguments --update
// NB: By default, if you don't specify --update or --rewrite, it's the argument --update which is selected

// To rewrite completely your md5 files got with --dest :
node index.js your_arguments  --rewrite
```

## License

MIT © [Kévin CARADANT](https://github.com/kevincaradant/generate_check_md5)

[npm-url]: https://npmjs.org/package/generate_check_md5
[npm-image]: https://img.shields.io/npm/v/generate_check_md5.svg?style=flat-square

[travis-url]: https://travis-ci.org/kevincaradant/generate_check_md5
[travis-image]: https://img.shields.io/travis/kevincaradant/generate_check_md5.svg?style=flat-square

[coveralls-url]: https://coveralls.io/r/kevincaradant/generate_check_md5
[coveralls-image]: https://img.shields.io/coveralls/kevincaradant/generate_check_md5.svg?style=flat-square

[depstat-url]: https://david-dm.org/kevincaradant/generate_check_md5
[depstat-image]: https://david-dm.org/kevincaradant/generate_check_md5.svg?style=flat-square

[depstat-url]: https://david-dm.org/kevincaradant/generate_check_md5
[depstat-image]: https://david-dm.org/kevincaradant/generate_check_md5/dev-status.svg?style=flat-square
