const checks = require('./checks.js');
const test = require('tape');
const path = require('path');

// CheckHelp
test('Call showHelp with Arg1', t => {
    t.plan(1);
    t.deepEqual(checks.showHelp(true, false), '\n  PARAMS:\n\n  To generate MD5 on console (only) :\n  --path "/path/to/the/my_directory_with_files/"\n\n  To generate MD5 and write it in the file :\n  --path "/path/to/the/my_directory_with_files/"\n  --dest "/path/to/write/file_md5_results.txt"\n\n  To compare md5 files :\n  --source "/path/to/the/md5_file_source_its_the_reference.txt/"\n  --compare "/path/to/the/md5_file_to_be_compared_with_source_file.txt/"\n\n  To generate AND compare md5 files in the same time:\n  --path "/path/to/the/my_directory_with_files/"\n  --dest "/path/to/write/file_md5_results.txt"\n  --source "/path/to/the/md5_file_source_its_the_reference.txt/"\n  --compare "/path/to/the/md5_file_to_be_compared_with_source_file.txt/"\n\n  OPTIONS:\n  To sort the output file with the arg --dest :\n  --sort\n\n  To rename files name in the file of results without space :\n  --nospace\n  Example:\n  Before: /Folder1/my file for example.mkv a9asd1171dd83e122598af664bd3f785)\n  After: /Folder1/my_file_for_example.mkv a9asd1171dd83e122598af664bd3f785)\n\n  To ask only an update between a path and your md5 files :\n  --update\n  NB: By default, if you don\'t specify --update or --rewrite, it\'s the argument --update which is selected\n\n  To rewrite completely your md5 files got with --dest :\n  --rewrite');
    t.end();
});

test('Call checkHelp with Arg1', t => {
    t.plan(1);
    t.false(checks.checkHelp(true, false));
    t.end();
});

test('Call checkHelp with Arg2', t => {
    t.plan(1);
    t.false(checks.checkHelp(false, true));
    t.end();
});

test('Call checkHelp with Arg1 & Arg2', t => {
    t.plan(1);
    t.false(checks.checkHelp(true, true));
    t.end();
});

test('Call checkHelp without Arg1 & Arg2', t => {
    t.plan(1);
    t.true(checks.checkHelp(false, false));
    t.end();
});

// findElemInArray
test('Call findElemInArray with Arg1(Array) = Arg2(Array)', t => {
    t.plan(1);
    const arrayElements1 = ['p1', 'p2', 'p3'];
    const arrayElements2 = ['p1', 'p2', 'p3'];
    t.true(checks.findElemInArray(arrayElements1, arrayElements2));
    t.end();
});

test('Call findElemInArray with Arg1(Array) != Arg2(Array) / 1/3 diff', t => {
    t.plan(1);
    const arrayElements1 = ['p1', 'p2', 'p4'];
    const arrayElements2 = ['p1', 'p2', 'p3'];
    t.false(checks.findElemInArray(arrayElements1, arrayElements2));
    t.end();
});

test('Call findElemInArray with Arg1(Array) != Arg2(Array) / 3/3 diff', t => {
    t.plan(1);
    const arrayElements1 = ['p11', 'p22', 'p4'];
    const arrayElements2 = ['p1', 'p2', 'p3'];
    t.false(checks.findElemInArray(arrayElements1, arrayElements2));
    t.end();
});

// findAtLeastOneElemInArray
test('Call findAtLeastOneElemInArray with Arg1(Array) = Arg2(Array)', t => {
    t.plan(1);
    const arrayElements1 = ['p1', 'p2', 'p3'];
    const arrayElements2 = ['p1', 'p2', 'p3'];
    t.true(checks.findAtLeastOneElemInArray(arrayElements1, arrayElements2));
    t.end();
});

test('Call findAtLeastOneElemInArray with Arg1(Array) != Arg2(Array) / 1/3 diff', t => {
    t.plan(1);
    const arrayElements1 = ['p1', 'p2', 'p4'];
    const arrayElements2 = ['p1', 'p2', 'p3'];
    t.true(checks.findAtLeastOneElemInArray(arrayElements1, arrayElements2));
    t.end();
});

test('Call findAtLeastOneElemInArray with Arg1(Array) != Arg2(Array) / 3/3 diff', t => {
    t.plan(1);
    const arrayElements1 = ['p11', 'p33', 'p4'];
    const arrayElements2 = ['p1', 'p2', 'p3'];
    t.false(checks.findAtLeastOneElemInArray(arrayElements1, arrayElements2));
    t.end();
});

// checkAllParamsFromUser
test('Call checkAllParamsFromUser with Arg1(Array) != Arg2(Array) / 1/3 diff', t => {
    t.plan(1);
    const arrayUserParams = ['p1', 'p2', 'p4'];
    const arrayAuthorizeParams = ['p1', 'p2', 'p3'];
    t.false(checks.checkAllParamsFromUser(arrayAuthorizeParams, arrayUserParams));
    t.end();
});

test('Call checkAllParamsFromUser with Arg1(Array) = Arg2(Array)', t => {
    t.plan(1);
    const arrayUserParams = ['p1', 'p2', 'p3'];
    const arrayAuthorizeParams = ['p1', 'p2', 'p3'];
    t.true(checks.checkAllParamsFromUser(arrayAuthorizeParams, arrayUserParams));
    t.end();
});

// isExistAtLeastOneParamFromUser
test('Call isExistAtLeastOneParamFromUser with Arg1(Array) != Arg2(Array) / 1/3 diff', t => {
    t.plan(1);
    const arrayUserParams = ['p1', 'p2', 'p4'];
    const arrayAuthorizeParams = ['p1', 'p2', 'p3'];
    t.true(checks.isExistAtLeastOneParamFromUser(arrayAuthorizeParams, arrayUserParams));
    t.end();
});

test('Call isExistAtLeastOneParamFromUser with Arg1(Array) != Arg2(Array) / 2/3 diff', t => {
    t.plan(1);
    const arrayUserParams = ['p1', 'p5', 'p4'];
    const arrayAuthorizeParams = ['p1', 'p2', 'p3'];
    t.true(checks.isExistAtLeastOneParamFromUser(arrayAuthorizeParams, arrayUserParams));
    t.end();
});

test('Call isExistAtLeastOneParamFromUser with Arg1(Array) != Arg2(Array) / 3/3 diff', t => {
    t.plan(1);
    const arrayUserParams = ['p4', 'p5', 'p6'];
    const arrayAuthorizeParams = ['p1', 'p2', 'p3'];
    t.false(checks.isExistAtLeastOneParamFromUser(arrayAuthorizeParams, arrayUserParams));
    t.end();
});

test('Call isExistAtLeastOneParamFromUser with Arg1(Array) = Arg2(Array)', t => {
    t.plan(1);
    const arrayUserParams = ['p1', 'p2', 'p3'];
    const arrayAuthorizeParams = ['p1', 'p2', 'p3'];
    t.true(checks.isExistAtLeastOneParamFromUser(arrayAuthorizeParams, arrayUserParams));
    t.end();
});

// isPathCorrect
test('Call isPathCorrect with NO Arg1', t => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isPathCorrect());
    rslt.then(data => {
        t.false(data);
        t.end();
    });
    t.end();
});

test('Call isPathCorrect with BAD Arg1(Number)', t => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isPathCorrect(12));
    rslt.then(data => {
        t.false(data);
        t.end();
    });
});

test('Call isPathCorrect with BAD(NULL) Arg1', t => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isPathCorrect(null));
    rslt.then(data => {
        t.false(data);
        t.end();
    });
});

test('Call isPathCorrect with BAD(FILE) Arg1(String)', t => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isPathCorrect('null'));
    rslt.then(data => {
        t.false(data);
        t.end();
    });
});

test('Call isPathCorrect with GOOD(FOLDER) Arg1(Array)', t => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isPathCorrect([__dirname]));
    rslt.then(data => {
        t.true(data);
        t.end();
    });
});

test('Call isPathCorrect with BAD(FILE) Arg1(String)', t => {
    const mock = require('mock-fs');
    t.plan(1);
    mock({
        'path/to/dir': {
            'test.txt': 'file contents here\nThis is the line 2'
        }
    });

    const rslt = Promise.resolve(checks.isPathCorrect('path/to/dir/test.txt'));
    rslt.then(data => {
        mock.restore();
        t.false(data);
        t.end();
    });
});

// isDestCorrect
test('Call isDestCorrect with NO Arg1', t => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isDestCorrect());
    rslt.then(data => {
        t.true(data);
        t.end();
    });
});

test('Call isDestCorrect with BAD Arg1(Number)', t => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isDestCorrect(12));
    rslt.then(data => {
        t.false(data);
        t.end();
    });
});

test('Call isDestCorrect with BAD(NULL) Arg1', t => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isDestCorrect(null));
    rslt.then(data => {
        t.true(data);
        t.end();
    });
});

test('Call isDestCorrect with BAD Arg1(String)', t => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isDestCorrect(path.join(__dirname, '/test.txt')));
    rslt.then(data => {
        t.true(data);
        t.end();
    });
});

test('Call isDestCorrect with GOOD(FILE) Arg1(String)', t => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isDestCorrect(path.join(__dirname, '/checks.spec.js')));
    rslt.then(data => {
        t.true(data);
        t.end();
    });
});

test('Call isDestCorrect with BAD(FOLDER) Arg1(String)', t => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isDestCorrect(__dirname));
    rslt.then(data => {
        t.false(data);
        t.end();
    });
});

// isSourceCorrect
test('Call isSourceCorrect with NO Arg1', t => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isSourceCorrect());
    rslt.then(data => {
        t.false(data);
        t.end();
    });
});

test('Call isSourceCorrect with BAD Arg1(Number)', t => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isSourceCorrect(12));
    rslt.then(data => {
        t.false(data);
        t.end();
    });
});

test('Call isSourceCorrect with BAD(FILE) Arg1(String)', t => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isSourceCorrect('null'));
    rslt.then(data => {
        t.false(data);
        t.end();
    });
});

test('Call isSourceCorrect with BAD(NULL) Arg1(String)', t => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isSourceCorrect(null));
    rslt.then(data => {
        t.false(data);
        t.end();
    });
});

test('Call isSourceCorrect with GOOD(FILE) Arg1(String)', t => {
    const mock = require('mock-fs');

    t.plan(1);

    mock({
        'path/to/dir': {
            'test.txt': 'file contents here\nThis is the line 2'
        }
    });

    const rslt = Promise.resolve(checks.isSourceCorrect('path/to/dir/test.txt'));
    rslt.then(data => {
        mock.restore();
        t.true(data);
        t.end();
    });
});

test('Call isSourceCorrect with BAD(FOLDER) Arg1(String)', t => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isSourceCorrect(__dirname));
    rslt.then(data => {
        t.false(data);
        t.end();
    });
});

// isCompareCorrect
test('Call isCompareCorrect with NO Arg1', t => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isCompareCorrect());
    rslt.then(data => {
        t.false(data);
        t.end();
    });
});

test('Call isCompareCorrect with BAD Arg1(Number)', t => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isCompareCorrect(12));
    rslt.then(data => {
        t.false(data);
        t.end();
    });
});

test('Call isCompareCorrect with BAD(FILE) Arg1(String)', t => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isCompareCorrect('null'));
    rslt.then(data => {
        t.false(data);
        t.end();
    });
});

test('Call isCompareCorrect with BAD(NULL) Arg1(String)', t => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isCompareCorrect(null));
    rslt.then(data => {
        t.false(data);
        t.end();
    });
});

test('Call isCompareCorrect with GOOD(FILE) Arg1(String)', t => {
    const mock = require('mock-fs');

    t.plan(1);

    mock({
        'path/to/dir': {
            'test.txt': 'file contents here\nThis is the line 2'
        }
    });

    const rslt = Promise.resolve(checks.isCompareCorrect('path/to/dir/test.txt'));
    rslt.then(data => {
        mock.restore();
        t.true(data);
        t.end();
    });
});

test('Call isCompareCorrect with BAD(FOLDER) Arg1(String)', t => {
    t.plan(1);
    const rslt = Promise.resolve(checks.isCompareCorrect(__dirname));
    rslt.then(data => {
        t.false(data);
        t.end();
    });
});

// showPathError
test('Call showPathError with Arg1(Boolean / True)', t => {
    t.plan(1);
    t.true(checks.showPathError(true));
    t.end();
});

test('Call showPathError with Arg1(Boolean / False)', t => {
    t.plan(1);
    t.false(checks.showPathError(false));
    t.end();
});

// showDestError
test('Call showDestError with Arg1(Boolean / True)', t => {
    t.plan(1);
    t.true(checks.showDestError(true));
    t.end();
});

test('Call showDestError with Arg1(Boolean / False)', t => {
    t.plan(1);
    t.true(checks.showDestError(false));
    t.end();
});

// showSourceError
test('Call showSourceError with Arg1(Boolean / True)', t => {
    t.plan(1);
    t.true(checks.showSourceError(true));
    t.end();
});

test('Call showSourceError with Arg1(Boolean / False)', t => {
    t.plan(1);
    t.false(checks.showSourceError(false));
    t.end();
});

// showCompareError
test('Call showCompareError with Arg1(Boolean / True)', t => {
    t.plan(1);
    t.true(checks.showCompareError(true));
    t.end();
});

test('Call showCompareError with Arg1(Boolean / False)', t => {
    t.plan(1);
    t.false(checks.showCompareError(false));
    t.end();
});

// showRewriteUpdateError
test('Call showRewriteUpdateError with Arg1(Boolean / True) and Arg2(Boolean / True)', t => {
    t.plan(1);
    t.false(checks.showRewriteUpdateError(true, true));
    t.end();
});

test('Call showRewriteUpdateError with Arg1(Boolean / True) and Arg2(Boolean / False)', t => {
    t.plan(1);
    t.true(checks.showRewriteUpdateError(true, false));
    t.end();
});

test('Call showRewriteUpdateError with Arg1(Boolean / False) and Arg2(Boolean / True)', t => {
    t.plan(1);
    t.true(checks.showRewriteUpdateError(false, true));
    t.end();
});

test('Call showRewriteUpdateError with Arg1(Boolean / False) and Arg2(Boolean / False)', t => {
    t.plan(1);
    t.true(checks.showRewriteUpdateError(false, false));
    t.end();
});