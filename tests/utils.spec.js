const utils = require('./utils.js');
const test = require('tape');
const path = require('path');

// readRecursiveFolders
test('Call readRecursiveFolders with GOOD Path Strings Array', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': 'file contents here\nThis is the line 2',
      'test2.txt': 'file contents here\nThis is the line 2',
      'test3.txt': 'file contents here\nThis is the line 2'
    },
    'path/to/dir2': {
      'test.txt': 'file contents here\nThis is the line 2',
      'test2.txt': 'file contents here\nThis is the line 2',
      'test3.txt': 'file contents here\nThis is the line 2'
    }
  });

  const rslt = Promise.resolve(utils.recursiveFolders(['path/to/']));
  rslt.then(data => {
    mock.restore();
    const p1 = path.normalize('path/to/dir/test.txt');
    const p2 = path.normalize('path/to/dir/test2.txt');
    const p3 = path.normalize('path/to/dir/test3.txt');
    const p4 = path.normalize('path/to/dir2/test.txt');
    const p5 = path.normalize('path/to/dir2/test2.txt');
    const p6 = path.normalize('path/to/dir2/test3.txt');

    t.deepEqual(data, [p1, p2, p3, p4, p5, p6]);
    t.end();
  });
});

test('Call readRecursiveFolders with BAD Path Strings Array', t => {
  t.plan(1);

  const rslt = Promise.resolve(utils.recursiveFolders(['path/to/dir']));
  rslt.then(data => {
    t.deepEqual(data, []);
    t.end();
  });
});

// readFile
test('Call readFile with GOOD(File) Arg1(String)', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': 'file contents here\nThis is the line 2'
    }
  });

  const rslt = Promise.resolve(utils.readFile('path/to/dir/test.txt'));
  rslt.then(data => {
    mock.restore();
    t.deepEqual(data, ['file contents here', 'This is the line 2']);
    t.end();
  });
});

test('Call readFile with BAD(FILE) Arg1(String)', t => {
  t.plan(1);

  const rslt = Promise.resolve(utils.readFile('path/to/dir/test.tx'));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

test('Call readFile with GOOD(FILE) Arg1(String / EMPTY)', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': ''
    }
  });

  const rslt = Promise.resolve(utils.readFile('path/to/dir/test.txt'));
  rslt.then(data => {
    mock.restore();
    t.deepEqual(data, []);
    t.end();
  });
});

test('Call readFile with BAD(NULL) Arg1', t => {
  t.plan(1);

  const rslt = Promise.resolve(utils.readFile(null));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

test('Call readFile with BAD(FOLDER) Arg1(String)', t => {
  t.plan(1);

  const rslt = Promise.resolve(utils.readFile(__dirname));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

// checkMD5
test('Call checkMD5 with GOOD(FILE) Arg1(String) = with GOOD(FILE) Arg2(String)', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': 'file contents here\nThis is the line 2',
      'test1.txt': 'file contents here\nThis is the line 2'
    }
  });
  const rslts = Promise.all([utils.readFile('path/to/dir/test.txt'), utils.readFile('path/to/dir/test1.txt')]);
  rslts.then(r => {
    const sourceArray = r[0];
    const compareArray = r[1];
    const rslt = Promise.resolve(utils.checkMD5(sourceArray, compareArray));
    rslt.then(data => {
      mock.restore();
      t.true(data);
      t.end();
    });
  });
});

test('Call checkMD5 with GOOD(FILE) Arg1(String) != with GOOD(FILE) Arg2(String)', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': 'file contents here\nThs is the line 2',
      'test1.txt': 'file contents here\nThis is the line 2'
    }
  });
  const rslts = Promise.all([utils.readFile('path/to/dir/test.txt'), utils.readFile('path/to/dir/test1.txt')]);
  rslts.then(r => {
    const sourceArray = r[0];
    const compareArray = r[1];
    const rslt = Promise.resolve(utils.checkMD5(sourceArray, compareArray));
    rslt.then(data => {
      mock.restore();
      t.true(data);
      t.end();
    });
  });
});

test('Call checkMD5 with GOOD(FILE) Arg1(String) != with BAD(NULL) Arg2', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': 'file contents here\nThis is the line 2',
      'test1.txt': 'file contents here\nThis is the line 2'
    }
  });

  const rsltPromise = Promise.resolve(utils.readFile('path/to/dir/test.txt'));
  rsltPromise.then(r => {
    const sourceArray = r[0];
    const rslt = Promise.resolve(utils.checkMD5(sourceArray, null));
    rslt.then(data => {
      mock.restore();
      t.false(data);
      t.end();
    });
  });
});

test('Call checkMD5 with BAD(NULL) Arg1 != with BAD(NULL) Arg2', t => {
  t.plan(1);

  const rslt = Promise.resolve(utils.checkMD5(null, null));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

test('Call checkMD5 with BAD(FILE) Arg1(String) != with BAD(FILE) Arg2(String)', t => {
  t.plan(1);

  const rslt = Promise.resolve(utils.checkMD5('null', 'null'));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

test('Call checkMD5 with BAD(FOLDER) Arg1(String) != with BAD(FOLDER) Arg2(String)', t => {
  t.plan(1);

  const rslt = Promise.resolve(utils.checkMD5(__dirname, __dirname));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

test('Call checkMD5 with BAD(NULL) Arg1 != with GOOD(FILE) Arg2(String)', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': 'file contents here\nThis is the line 2',
      'test1.txt': 'file contents here\nThis is the line 2'
    }
  });

  const rsltPromise = Promise.resolve(utils.readFile('path/to/dir/test.txt'));
  rsltPromise.then(r => {
    const compareArray = r[0];
    const rslt = Promise.resolve(utils.checkMD5(null, compareArray));
    rslt.then(data => {
      mock.restore();
      t.false(data);
      t.end();
    });
  });
});

// compareMD5
test('Call compareMD5 with BAD(FILE) Arg1(String) != with GOOD(FILE) Arg2(String)', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': 'file contents here\nThis is the line 2',
      'test1.txt': 'file contents here\nThis is the line 2'
    }
  });

  const rslt = Promise.resolve(utils.compareMD5('path/to/dir/test3.txt', 'path/to/dir/test.txt'));
  rslt.then(data => {
    mock.restore();
    t.false(data);
    t.end();
  });
});

test('Call compareMD5 with GOOD(FILE) Arg1(String) = with GOOD(FILE) Arg2(String)', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': 'file contents here\nThis is the line 2',
      'test1.txt': 'file contents here\nThis is the line 2'
    }
  });

  const rslt = Promise.resolve(utils.compareMD5('path/to/dir/test.txt', 'path/to/dir/test1.txt'));
  rslt.then(data => {
    mock.restore();
    t.true(data);
    t.end();
  });
});

test('Call compareMD5 with GOOD(FILE) Arg1(String) != with GOOD(FILE) Arg2(String)', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': 'file contents here\nThs is the line 2',
      'test1.txt': 'file contents here\nThis is the line 2'
    }
  });

  const rslt = Promise.resolve(utils.compareMD5('path/to/dir/test.txt', 'path/to/dir/test1.txt'));
  rslt.then(data => {
    mock.restore();
    t.true(data);
    t.end();
  });
});

test('Call compareMD5 with with GOOD(FILE) Arg1(String) != with BAD(FILE) Arg2(String)', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': 'file contents here\nThis is the line 2',
      'test1.txt': 'file contents here\nThis is the line 2'
    }
  });

  const rslt = Promise.resolve(utils.compareMD5('path/to/dir/test.txt', 'path/to/dir/test3.txt'));
  rslt.then(data => {
    mock.restore();
    t.false(data);
    t.end();
  });
});

test('Call compareMD5 with BAD(FILE) Arg1(String) != with BAD(FILE) Arg2(String)', t => {
  t.plan(1);
  const rslt = Promise.resolve(utils.compareMD5('path/to/dir/test3.txt', 'path/to/dir/test3.txt'));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

test('Call compareMD5 with BAD(NULL) Arg1 != with BAD(FILE) Arg2(String)', t => {
  t.plan(1);
  const rslt = Promise.resolve(utils.compareMD5(null, 'path/to/dir/test3.txt'));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

test('Call compareMD5 with BAD(FILE) Arg1(String) != with BAD(NULL) Arg2', t => {
  t.plan(1);
  const rslt = Promise.resolve(utils.compareMD5('path/to/dir/test3.txt', null));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

test('Call compareMD5 with BAD(FOLDER) Arg1(String) != with BAD(FOLDER) Arg2(String)', t => {
  t.plan(1);
  const rslt = Promise.resolve(utils.compareMD5(__dirname, __dirname));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

test('Call compareMD5 with BAD(NULL) Arg1 != with GOOD(FILE) Arg2(String)', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': 'file contents here\nThis is the line 2',
      'test1.txt': 'file contents here\nThis is the line 2'
    }
  });

  const rslt = Promise.resolve(utils.compareMD5(null, 'path/to/dir/test.txt'));
  rslt.then(data => {
    mock.restore();
    t.false(data);
    t.end();
  });
});

test('Call compareMD5 with GOOD(FILE) Arg1(String) != with BAD(NULL) Arg2', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': 'file contents here\nThis is the line 2',
      'test1.txt': 'file contents here\nThis is the line 2'
    }
  });

  const rslt = Promise.resolve(utils.compareMD5('path/to/dir/test.txt', null));
  rslt.then(data => {
    mock.restore();
    t.false(data);
    t.end();
  });
});

// // analyseMD5
test('Call analyseMD5 with GOOD(FILE) Arg1(String) != with GOOD(FILES) Arg2(Array) ADD_LINES', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': 'file cotents : here\nThis is the : line 2',
      'test1.txt': 'file contents : here\nTis is the : line 2'
    }
  });

  const rsltPromise = Promise.resolve(utils.readFile('path/to/dir/test1.txt'));
  rsltPromise.then(r => {
    const rslt = Promise.resolve(utils.analyseMD5('path/to/dir/test.txt', r));
    rslt.then(data => {
      mock.restore();
      t.true(data);
      t.end();
    });
  });
});

test('Call analyseMD5 with GOOD(FILE) Arg1(String) != with GOOD(FILES) Arg2(Array)  REMOVE_LINES', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': 'This is the : line 2\n Tis is the : line 2',
      'test1.txt': 'This is the : line 2'
    }
  });

  const rsltPromise = Promise.resolve(utils.readFile('path/to/dir/test1.txt'));
  rsltPromise.then(r => {
    const rslt = Promise.resolve(utils.analyseMD5('path/to/dir/test.txt', r, false));
    rslt.then(data => {
      mock.restore();
      t.true(data);
      t.end();
    });
  });
});

test('Call analyseMD5 with GOOD(FILE) Arg1(String) != with GOOD(FILES) Arg2(Array) AND Arg3(Boolean / True) ADD_REMOVE_LINES', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': '1234567 : Ths is the line 2',
      'test1.txt': '123567 : This is the line 2'
    }
  });

  const rsltPromise = Promise.resolve(utils.readFile('path/to/dir/test.txt'));
  rsltPromise.then(r => {
    const rslt = Promise.resolve(utils.analyseMD5('path/to/dir/test1.txt', r, true));
    rslt.then(data => {
      mock.restore();
      t.deepEquals(data, {getFilesToRemoveArray: ['This is the line 2'], getNewFilesToAddArray: ['1234567 : Ths is the line 2']});
      t.end();
    });
  });
});

test('Call analyseMD5 with BAD(NULL) Arg1 != with BAD(NULL) Arg2', t => {
  t.plan(1);
  const rslt = Promise.resolve(utils.analyseMD5(null, null));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

test('Call analyseMD5 with BAD(FOLDER) Arg1(String) != with BAD(FOLDER) Arg2(String)', t => {
  t.plan(1);
  const rslt = Promise.resolve(utils.analyseMD5(__dirname, __dirname));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

test('Call analyseMD5 with GOOD(FILE) Arg1(String) != with BAD(NULL) Arg2', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': 'file contents here\nThis is the line 2',
      'test1.txt': 'file contents here\nThis is the line 2'
    }
  });

  const rslt = Promise.resolve(utils.analyseMD5('path/to/dir/test.txt', null));
  rslt.then(data => {
    mock.restore();
    t.false(data);
    t.end();
  });
});

test('Call analyseMD5 with BAD(FILE) Arg1(String) != with GOOD(FILES) Arg2(Array)', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': 'file contents here\nThis is the line 2',
      'test1.txt': 'file contents here\nThis is the line 2'
    }
  });

  const rsltPromise = Promise.resolve(utils.readFile('path/to/dir/test.txt'));
  rsltPromise.then(r => {
    const rslt = Promise.resolve(utils.analyseMD5('path/to/dir/test3.txt', r));
    rslt.then(data => {
      mock.restore();
      t.false(data);
      t.end();
    });
  });
});

// quickDumpMD5FileDest
test('Call quickDumpMD5FileDest with GOOD(FILES) Arg1(Array) != with GOOD(FILE) Arg2(String)', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': 'file contents here\nThis is the line 2',
      'test2.txt': 'file contents here\nThis is the line 2'
    }
  });

  const rsltPromise = Promise.resolve(utils.readFile('path/to/dir/test2.txt'));
  rsltPromise.then(r => {
    const rslt = Promise.resolve(utils.quickDumpMD5FileDest(r, 'path/to/dir/test.txt'));
    rslt.then(data => {
      mock.restore();
      t.true(data);
      t.end();
    });
  });
});

test('Call quickDumpMD5FileDest with BAD(NULL) Arg1 != with GOOD(FILE) Arg2(String)', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': 'file contents here\nThis is the line 2',
      'test2.txt': 'file contents here\nThis is the line 2'
    }
  });

  const rslt = Promise.resolve(utils.quickDumpMD5FileDest(null, 'path/to/dir/test.txt'));
  rslt.then(data => {
    mock.restore();
    t.false(data);
    t.end();
  });
});

test('Call quickDumpMD5FileDest with  GOOD(FILES) Arg1(Array) != with BAD(NULL) Arg2', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': 'file contents here\nThis is the line 2',
      'test2.txt': 'file contents here\nThis is the line 2'
    }
  });

  const rsltPromise = Promise.resolve(utils.readFile('path/to/dir/test2.txt'));
  rsltPromise.then(r => {
    const rslt = Promise.resolve(utils.quickDumpMD5FileDest(r, null));
    rslt.then(data => {
      mock.restore();
      t.false(data);
      t.end();
    });
  });
});

test('Call quickDumpMD5FileDest with BAD(NULL) Arg1 != with BAD(FILE) Arg2(String)', t => {
  t.plan(1);
  const rslt = Promise.resolve(utils.quickDumpMD5FileDest(null, 'path/to/dir/test2.txt'));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

test('Call quickDumpMD5FileDest with BAD(FOLDER) Arg1(String) != with BAD(FOLDER) Arg2(String)', t => {
  t.plan(1);
  const rslt = Promise.resolve(utils.quickDumpMD5FileDest(__dirname, __dirname));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

test('Call quickDumpMD5FileDest with GOOD(FILES) Arg1(Array) != with BAD(FILE) Arg2(String)', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': 'file contents here\nThis is the line 2',
      'test2.txt': 'file contents here\nThis is the line 2'
    }
  });

  const rsltPromise = Promise.resolve(utils.readFile('path/to/dir/test2.txt'));
  rsltPromise.then(r => {
    const rslt = Promise.resolve(utils.quickDumpMD5FileDest(r, 'path/to/dir/test3.txt'));
    rslt.then(data => {
      mock.restore();
      t.true(data);
      t.end();
    });
  });
});

// naturalCompare
test('Call naturalCompare with Line 1 < Line 2 (String)', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': '111111111111 : file contents here\n22222222222 : This is the line 2'
    }
  });

  const rsltPromise = Promise.resolve(utils.readFile('path/to/dir/test.txt'));
  rsltPromise.then(r => {
    const rslt = Promise.resolve(utils.naturalCompare(r[0], r[1]));
    rslt.then(data => {
      mock.restore();
      t.ok(data > 0);
      t.end();
    });
  });
});

test('Call naturalCompare with Line 2 < Line 1 (String)', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': '1111111111111 : file contents here\n2222222222222222222 : This is the line 2'
    }
  });

  const rsltPromise = Promise.resolve(utils.readFile('path/to/dir/test.txt'));
  rsltPromise.then(r => {
    const rslt = Promise.resolve(utils.naturalCompare(r[0], r[1]));
    rslt.then(data => {
      mock.restore();
      t.ok(data < 0);
      t.end();
    });
  });
});

test('Call naturalCompare with Line 2(String) = Line 1 (String)', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': '1111111111111 : file contents here\n1111111111111 : file contents here'
    }
  });

  const rsltPromise = Promise.resolve(utils.readFile('path/to/dir/test.txt'));
  rsltPromise.then(r => {
    const rslt = Promise.resolve(utils.naturalCompare(r[0], r[1]));
    rslt.then(data => {
      mock.restore();
      t.ok(data === 0);
      t.end();
    });
  });
});

test('Call naturalCompare with BAD(null) Arg1 && BAD(null) Arg2', t => {
  t.plan(1);

  const rslt = Promise.resolve(utils.naturalCompare(null, null));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

// sortFileDest
test('Call sortFileDest with GOOD(FILE) Arg1(String)', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': 'file contents here\nThis is the line 2',
      'test2.txt': 'file contents here\nThis is the line 2'
    }
  });

  const rslt = Promise.resolve(utils.sortFileDest('path/to/dir/test2.txt'));
  rslt.then(data => {
    mock.restore();
    t.true(data);
    t.end();
  });
});

test('Call sortFileDest with BAD(NULL) Arg1', t => {
  t.plan(1);

  const rslt = Promise.resolve(utils.sortFileDest(null));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

test('Call sortFileDest with BAD(FILE) Arg1(String)', t => {
  t.plan(1);

  const rslt = Promise.resolve(utils.sortFileDest('null'));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

test('Call sortFileDest with BAD(FOLDER) Arg1(String)', t => {
  t.plan(1);

  const rslt = Promise.resolve(utils.sortFileDest(__dirname));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

test('Call writeMD5FileDest with BAD(FOLDER) Arg1(Array) AND BAD(FOLDER) Arg2(Array)', t => {
  t.plan(1);

  const rslt = Promise.resolve(utils.writeMD5FileDest(__dirname, __dirname));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

test('Call writeMD5FileDest with BAD(NULL) Arg1 AND BAD(NULL) Arg2', t => {
  t.plan(1);

  const rslt = Promise.resolve(utils.writeMD5FileDest(null, null));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

test('Call writeMD5FileDest with GOOD(FILE) Arg1 AND BAD(NULL) Arg2', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': 'file contents here\nThis is the line 2',
      'test2.txt': 'file contents here\nThis is the line 2'
    }
  });

  const rsltPromise = Promise.resolve(utils.readFile('path/to/dir/test2.txt'));
  rsltPromise.then(r => {
    const rslt = Promise.resolve(utils.writeMD5FileDest(r, null));
    rslt.then(data => {
      mock.restore();
      t.false(data);
      t.end();
    });
  });
});

test('Call writeMD5FileDest with BAD(NULL) Arg1 AND GOOD(FILE) Arg2(Array)', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': 'file contents here\nThis is the line 2',
      'test2.txt': 'file contents here\nThis is the line 2'
    }
  });

  const rsltPromise = Promise.resolve(utils.readFile('path/to/dir/test2.txt'));
  rsltPromise.then(r => {
    const rslt = Promise.resolve(utils.writeMD5FileDest(null, r));
    rslt.then(data => {
      mock.restore();
      t.false(data);
      t.end();
    });
  });
});

test('Call writeMD5FileDest with GOOD(FILE) Arg1(Array) AND GOOD(FILE) Arg2(Array)', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': 'file contents here\nThis is the line 2',
      'test2.txt': 'file contents here\nThis is the line 2'
    }
  });

  const rsltPromise = Promise.resolve(utils.readFile('path/to/dir/test2.txt'));
  rsltPromise.then(r => {
    const rslt = Promise.resolve(utils.writeMD5FileDest(r, r));
    rslt.then(data => {
      mock.restore();
      t.true(data);
      t.end();
    });
  });
});

test('Call writeMD5FileDest with GOOD(FILE) Arg1(Array) AND GOOD(FILE) Arg2(Array) with DEST ARG AND NOSPACE ARG', t => {
  const mock = require('mock-fs');
  t.plan(1);

  mock({
    'path/to/dir': {
      'test.txt': 'file contents here',
      'test2.txt': 'file contents here',
      'test3.txt': 'file contents here\nThis is the line 2'
    }
  });

  const rsltPromise = Promise.resolve(utils.readFile('path/to/dir/test2.txt'));
  rsltPromise.then(r => {
    const rslt = Promise.resolve(utils.writeMD5FileDest(r, r, 'path/to/dir/test3.txt', false, false, true));
    rslt.then(data => {
      mock.restore();
      t.true(data);
      t.end();
    });
  });
});
