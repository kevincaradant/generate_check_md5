import * as checks from '../src/checks';
import * as rimraf from 'rimraf';
const test = require('tape');
const path = require('path');

(() => {
  // CheckHelp
  test('Call showHelp with Arg1', (t: any) => {
    t.plan(1);
    t.deepEqual(checks.showHelp(), `
  PARAMS:

  To generate MD5 on console (only) :
  --path "/path/to/the/my_directory_with_files/"

  To generate MD5 and write it in the file :
  --path "/path/to/the/my_directory_with_files/"
  --dest "/path/to/write/file_md5_results.txt"

  To compare md5 files :
  --source "/path/to/the/md5_file_source_its_the_reference.txt/"
  --compare "/path/to/the/md5_file_to_be_compared_with_source_file.txt/"

  To generate AND compare md5 files in the same time:
  --path "/path/to/the/my_directory_with_files/"
  --dest "/path/to/write/file_md5_results.txt"
  --source "/path/to/the/md5_file_source_its_the_reference.txt/"
  --compare "/path/to/the/md5_file_to_be_compared_with_source_file.txt/"

  OPTIONS:
  To sort the output file with the arg --dest :
  --sort

  To rename files name in the file of results without space :
  --nospace
  Example:
  Before: /Folder1/my file for example.mkv a9asd1171dd83e122598af664bd3f785)
  After: /Folder1/my_file_for_example.mkv a9asd1171dd83e122598af664bd3f785)

  To ask only an update between a path and your md5 files :
  --update
  NB: By default, if you don't specify --update or --rewrite, it's the argument --update which is selected

  To rewrite completely your md5 files got with --dest :
  --rewrite`);
    t.end();
  });

  test('Call checkHelp with Arg1', (t: any) => {
    t.plan(1);
    t.false(checks.checkHelp(true, false));
    t.end();
  });

  test('Call checkHelp with Arg2', (t: any) => {
    t.plan(1);
    t.false(checks.checkHelp(false, true));
    t.end();
  });

  test('Call checkHelp with Arg1 & Arg2', (t: any) => {
    t.plan(1);
    t.false(checks.checkHelp(true, true));
    t.end();
  });

  test('Call checkHelp without Arg1 & Arg2', (t: any) => {
    t.plan(1);
    t.true(checks.checkHelp(false, false));
    t.end();
  });

  // findAllElemInArray
  test('Call findAllElemInArray with Arg1(Array) = Arg2(Array)', (t: any) => {
    t.plan(1);
    const arrayElements1 = ['p1', 'p2', 'p3'];
    const arrayElements2 = ['p1', 'p2', 'p3'];
    t.true(checks.findAllElemInArray(arrayElements1, arrayElements2));
    t.end();
  });

  test('Call findAllElemInArray with Arg1(Array) != Arg2(Array) / 1/3 diff', (t: any) => {
    t.plan(1);
    const arrayElements1 = ['p1', 'p2', 'p4'];
    const arrayElements2 = ['p1', 'p2', 'p3'];
    t.false(checks.findAllElemInArray(arrayElements1, arrayElements2));
    t.end();
  });

  test('Call findAllElemInArray with Arg1(Array) != Arg2(Array) / 3/3 diff', (t: any) => {
    t.plan(1);
    const arrayElements1 = ['p11', 'p22', 'p4'];
    const arrayElements2 = ['p1', 'p2', 'p3'];
    t.false(checks.findAllElemInArray(arrayElements1, arrayElements2));
    t.end();
  });

  // isExistElemBetweenTwoArrays
  test('Call isExistElemBetweenTwoArrays with Arg1(Array) = Arg2(Array)', (t: any) => {
    t.plan(1);
    const arrayElements1 = ['p1', 'p2', 'p3'];
    const arrayElements2 = ['p1', 'p2', 'p3'];
    t.true(checks.isExistElemBetweenTwoArrays(arrayElements1, arrayElements2));
    t.end();
  });

  test('Call isExistElemBetweenTwoArrays with Arg1(Array) != Arg2(Array) / 1/3 diff', (t: any) => {
    t.plan(1);
    const arrayElements1 = ['p1', 'p2', 'p4'];
    const arrayElements2 = ['p1', 'p2', 'p3'];
    t.true(checks.isExistElemBetweenTwoArrays(arrayElements1, arrayElements2));
    t.end();
  });

  test('Call isExistElemBetweenTwoArrays with Arg1(Array) != Arg2(Array) / 3/3 diff', (t: any) => {
    t.plan(1);
    const arrayElements1 = ['p11', 'p33', 'p4'];
    const arrayElements2 = ['p1', 'p2', 'p3'];
    t.false(checks.isExistElemBetweenTwoArrays(arrayElements1, arrayElements2));
    t.end();
  });

  // checkAllParamsFromUser
  test('Call checkAllParamsFromUser with Arg1(Array) != Arg2(Array) / 1/3 diff', (t: any) => {
    t.plan(1);
    const arrayUserParams = ['p1', 'p2', 'p4'];
    const arrayAuthorizeParams = ['p1', 'p2', 'p3'];
    t.false(checks.checkAllParamsFromUser(arrayAuthorizeParams, arrayUserParams));
    t.end();
  });

  test('Call checkAllParamsFromUser with Arg1(Array) = Arg2(Array)', (t: any) => {
    t.plan(1);
    const arrayUserParams = ['p1', 'p2', 'p3'];
    const arrayAuthorizeParams = ['p1', 'p2', 'p3'];
    t.true(checks.checkAllParamsFromUser(arrayAuthorizeParams, arrayUserParams));
    t.end();
  });

  // isExistAtLeastOneParamFromUser
  test('Call isExistAtLeastOneParamFromUser with Arg1(Array) != Arg2(Array) / 1/3 diff', (t: any) => {
    t.plan(1);
    const arrayUserParams = ['p1', 'p2', 'p4'];
    const arrayAuthorizeParams = ['p1', 'p2', 'p3'];
    t.true(checks.isExistAtLeastOneParamFromUser(arrayAuthorizeParams, arrayUserParams));
    t.end();
  });

  test('Call isExistAtLeastOneParamFromUser with Arg1(Array) != Arg2(Array) / 2/3 diff', (t: any) => {
    t.plan(1);
    const arrayUserParams = ['p1', 'p5', 'p4'];
    const arrayAuthorizeParams = ['p1', 'p2', 'p3'];
    t.true(checks.isExistAtLeastOneParamFromUser(arrayAuthorizeParams, arrayUserParams));
    t.end();
  });

  test('Call isExistAtLeastOneParamFromUser with Arg1(Array) != Arg2(Array) / 3/3 diff', (t: any) => {
    t.plan(1);
    const arrayUserParams = ['p4', 'p5', 'p6'];
    const arrayAuthorizeParams = ['p1', 'p2', 'p3'];
    t.false(checks.isExistAtLeastOneParamFromUser(arrayAuthorizeParams, arrayUserParams));
    t.end();
  });

  test('Call isExistAtLeastOneParamFromUser with Arg1(Array) = Arg2(Array)', (t: any) => {
    t.plan(1);
    const arrayUserParams = ['p1', 'p2', 'p3'];
    const arrayAuthorizeParams = ['p1', 'p2', 'p3'];
    t.true(checks.isExistAtLeastOneParamFromUser(arrayAuthorizeParams, arrayUserParams));
    t.end();
  });

  test('Call handlingArgvOnErrMessage with --path Arg', (t: any) => {
    t.plan(1);
    const mock = require('mock-fs');

    mock({
      'path/to/dir': {
        'test.txt': 'file contents here : This is the line 2',
        'test1.txt': 'file contents here : This is the line 2'
      }
    });
    mock.restore();
    t.false(checks._handlingArgvOnErrMessage('My custom error', 'path/to/dir/test.txt', 'path'));
    t.end();
  });

  test('Call handlingArgvOnErrMessage with --path dest which can be created', (t: any) => {
    t.plan(1);
    const mock = require('mock-fs');

    mock({
      'path/to/dir': {
        'test.txt': 'file contents here : This is the line 2',
        'test1.txt': 'file contents here : This is the line 2'
      }
    });

    mock.restore();
    t.true(checks._handlingArgvOnErrMessage('My custom error', __dirname + 'test2.txt', 'dest'));

    rimraf(__dirname + 'test2.txt', () => {
      t.end();
    });
  });

  test('Call isPathCorrect with GOOD(FOLDER) Arg1(Array)', (t: any) => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isPathCorrect([__dirname]));
    rslt.then(data => {
      t.true(data);
      t.end();
    });
  });

  test('Call isPathCorrect with BAD(FOLDER) Arg1(Array)', (t: any) => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isPathCorrect([]));
    rslt.then(data => {
      t.false(data);
      t.end();
    });
  });

  test('Call isPath with GOOD Arg1(string)', (t: any) => {
    t.plan(1);
    let data = checks._isPath('path');
    t.true(data);
    t.end();
  });

  test('Call isPath with BAD Arg1(string)', (t: any) => {
    t.plan(1);
    let data = checks._isPath('dest');
    t.false(data);
    t.end();
  });

  test('Call isDest with GOOD Arg1(string)', (t: any) => {
    t.plan(1);
    let data = checks._isDest('dest');
    t.true(data);
    t.end();
  });

  test('Call isDest with BAD Arg1(string)', (t: any) => {
    t.plan(1);
    let data = checks._isDest();
    t.false(data);
    t.end();
  });

  test('Call isCompare with GOOD Arg1(string)', (t: any) => {
    t.plan(1);
    let data = checks._isCompare('compare');
    t.true(data);
    t.end();
  });

  test('Call isCompare with BAD Arg1(string)', (t: any) => {
    t.plan(1);
    let data = checks._isCompare();
    t.false(data);
    t.end();
  });

  test('Call isSource with GOOD Arg1(string)', (t: any) => {
    t.plan(1);
    let data = checks._isSource('source');
    t.true(data);
    t.end();
  });

  test('Call isSource with BAD Arg1(string)', (t: any) => {
    t.plan(1);
    let data = checks._isSource();
    t.false(data);
    t.end();
  });

  test('Call _isENOENTError with GOOD Arg1(object)', (t: any) => {
    t.plan(1);
    const error = {
      code: 'ENOENT'
    };

    let data = checks._isENOENTError(error);
    t.true(data);
    t.end();
  });

  test('Call _isENOENTError with BAD Arg1(object)', (t: any) => {
    t.plan(1);
    const error = {
      code: 'ENOENT1'
    };

    let data = checks._isENOENTError(error);
    t.false(data);
    t.end();
  });

  test('Call _isFile with GOOD Arg1(file)', (t: any) => {
    t.plan(1);
    const mock = require('mock-fs');
    const fs = require('fs');
    mock({
      'path/to/dir': {
        'test.txt': 'file contents here : This is the line 2',
        'test1.txt': 'file contents here : This is the line 2'
      }
    });

    fs.stat('path/to/dir/test.txt', (err: any, stats: any) => {
      mock.restore();
      console.error(err);
      t.true(checks._isFile(stats));
      t.end();
    });
  });

  test('Call _isDirectory with BAD Arg1(folder)', (t: any) => {
    t.plan(1);
    const mock = require('mock-fs');
    const fs = require('fs');

    mock({
      'path/to/dir': {
        'test.txt': 'file contents here : This is the line 2',
        'test1.txt': 'file contents here : This is the line 2'
      }
    });

    fs.stat('path/to/dir/test.txt', (err: any, stats: any) => {
      mock.restore();
      console.error(err);
      t.false(checks._isDirectory(stats));
      t.end();
    });
  });

  test('Call _isDirectory with GOOD Arg1(folder)', (t: any) => {
    t.plan(1);
    const mock = require('mock-fs');
    const fs = require('fs');

    mock({
      'path/to/dir': {
        'test.txt': 'file contents here : This is the line 2',
        'test1.txt': 'file contents here : This is the line 2'
      }
    });

    fs.stat('path/to/dir/', (err: any, stats: any) => {
      mock.restore();
      console.error(err);
      t.true(checks._isDirectory(stats));
      t.end();
    });
  });

  // isDestCorrect
  test('Call isDestCorrect with NO Arg1', (t: any) => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isDestCorrect());
    rslt.then(data => {
      t.true(data);
      t.end();
    });
  });

  test('Call isDestCorrect with BAD Arg1(String)', (t: any) => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isDestCorrect(path.join(__dirname, '/test.txt')));
    rslt.then(data => {
      t.true(data);
      rimraf(__dirname + '/test.txt', () => {
        t.end();
      });
    });
  });

  test('Call isDestCorrect with GOOD(FILE) Arg1(String)', (t: any) => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isDestCorrect(path.join(__dirname, '/checks.spec.js')));
    rslt.then(data => {
      t.true(data);
      t.end();
    });
  });

  // isSourceCorrect
  test('Call isSourceCorrect with NO Arg1', (t: any) => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isSourceCorrect());
    rslt.then(data => {
      t.false(data);
      t.end();
    });
  });

  test('Call isSourceCorrect with GOOD Arg1(string)', (t: any) => {
    t.plan(1);
    const mock = require('mock-fs');

    mock({
      'path/to/dir': {
        'test.txt': 'file contents here : This is the line 2',
        'test1.txt': 'file contents here : This is the line 2'
      }
    });

    const rslt = Promise.resolve(checks.isSourceCorrect('path/to/dir/test.txt'));
    rslt.then(data => {
      t.true(data);
      t.end();
    });
  });

  // isCompareCorrect
  test('Call isCompareCorrect with NO Arg1', (t: any) => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isCompareCorrect());
    rslt.then(data => {
      t.false(data);
      t.end();
    });
  });

  test('Call isCompareCorrect with GOOD Arg1(string)', (t: any) => {
    t.plan(1);
    const mock = require('mock-fs');

    mock({
      'path/to/dir': {
        'test.txt': 'file contents here : This is the line 2',
        'test1.txt': 'file contents here : This is the line 2'
      }
    });

    const rslt = Promise.resolve(checks.isCompareCorrect('path/to/dir/test.txt'));
    rslt.then(data => {
      t.true(data);
      t.end();
    });
  });

  // showPathError

  test('Call showPathError with Arg1(Boolean / True)', (t: any) => {
    t.plan(1);
    t.true(checks.showPathError(['true']));
    t.end();
  });

  test('Call showPathError with Arg1(Array empty)', (t: any) => {
    t.plan(1);
    t.false(checks.showPathError());
    t.end();
  });

  // showDestError
  test('Call showDestError with Arg1(Boolean / True)', (t: any) => {
    t.plan(1);
    t.true(checks.showDestError('true'));
    t.end();
  });

  test('Call showDestError no Arg1', (t: any) => {
    t.plan(1);
    t.true(checks.showDestError());
    t.end();
  });

  // showSourceError
  test('Call showSourceError with Arg1(Boolean / True)', (t: any) => {
    t.plan(1);
    t.true(checks.showSourceError('true'));
    t.end();
  });

  test('Call showSourceError with no Arg1', (t: any) => {
    t.plan(1);
    t.false(checks.showSourceError());
    t.end();
  });

  // showCompareError
  test('Call showCompareError with Arg1(Boolean / True)', (t: any) => {
    t.plan(1);
    t.true(checks.showCompareError('true'));
    t.end();
  });

  test('Call showCompareError with no Arg1', (t: any) => {
    t.plan(1);
    t.false(checks.showCompareError());
    t.end();
  });

  // showRewriteUpdateError
  test('Call showRewriteUpdateError with Arg1(Boolean / True) and Arg2(Boolean / True)', (t: any) => {
    t.plan(1);
    t.false(checks.showRewriteUpdateError(true, true));
    t.end();
  });

  test('Call showRewriteUpdateError with Arg1(Boolean / True) and Arg2(Boolean / False)', (t: any) => {
    t.plan(1);
    t.true(checks.showRewriteUpdateError(true, false));
    t.end();
  });

  test('Call showRewriteUpdateError with Arg1(Boolean / False) and Arg2(Boolean / True)', (t: any) => {
    t.plan(1);
    t.true(checks.showRewriteUpdateError(false, true));
    t.end();
  });

  test('Call showRewriteUpdateError with Arg1(Boolean / False) and Arg2(Boolean / False)', (t: any) => {
    t.plan(1);
    t.true(checks.showRewriteUpdateError(false, false));
    t.end();
  });
})();
