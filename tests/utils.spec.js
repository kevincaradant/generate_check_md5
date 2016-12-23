const utils = require('./utils.js');
const test = require('tape');

// readFile
test('Call readFile with a good file', t => {
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

test('Call readFile with a bad path file', t => {
  t.plan(1);

  const rslt = Promise.resolve(utils.readFile('path/to/dir/test.tx'));
  rslt.catch(data => {
    t.equal(data.code, 'ENOENT');
    t.end();
  });
});

test('Call readFile empty file', t => {
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

// checkMD5
test('Call checkMD5 with source and compare path correct', t => {
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

test('Call checkMD5 with source path file valid and compare path file invalid', t => {
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

test('Call checkMD5 with source and compare path file invalid', t => {
  t.plan(1);

  const rslt = Promise.resolve(utils.checkMD5(null, 'path/to/dir/test2.txt'));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

test('Call checkMD5 with source path file invalid and compare path file valid', t => {
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
test('Call compareMD5 with a invalid source file and a valid compare file', t => {
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

test('Call compareMD5 with a valid source file and a valid compare file', t => {
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

test('Call compareMD5 with a valid source path and a invalid compare path', t => {
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

test('Call compareMD5 a invalid source path and a invalid compare path', t => {
  t.plan(1);
  const rslt = Promise.resolve(utils.compareMD5('path/to/dir/test3.txt', 'path/to/dir/test3.txt'));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

// // analyseMD5
test('Call analyseMD5 with two good arrays and a good space arg', t => {
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
//
// test('Call analyseMD5 with two bad source and path and a bad space arg', t => {
//   t.plan(1);
//   const arraySource = null;
//   const arrayPath = null;
//   t.false(utils.analyseMD5(arraySource, arrayPath, false));
//   t.end();
// });
//
// test('Call analyseMD5 with one source arg null and good path arg ', t => {
//   t.plan(1);
//   const arraySource = null;
//   const arrayPath = __dirname;
//   t.false(utils.analyseMD5(arraySource, arrayPath));
//   t.end();
// });
