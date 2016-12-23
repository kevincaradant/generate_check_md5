const utils = require('./utils.js');
const test = require('tape');

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
test('Call analyseMD5 with GOOD(FILE) Arg1(String) != with GOOD(FILES) Arg2(Array) AND Arg3(Boolean / True)', t => {
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
    const rslt = Promise.resolve(utils.analyseMD5('path/to/dir/test.txt', r));
    rslt.then(data => {
      mock.restore();
      t.true(data);
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
      t.false(data);
      t.end();
    });
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
    console.log(data);
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
