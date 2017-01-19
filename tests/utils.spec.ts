import * as utils from '../src/utils';
const test = require('tape');
const path = require('path');
(() => {
  // readRecursiveFolders
  test('Call readRecursiveFolders with GOOD Path Strings Array', (t: any) => {
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
      const arr = [
        path.normalize('path/to/dir/test.txt'),
        path.normalize('path/to/dir/test2.txt'),
        path.normalize('path/to/dir/test3.txt'),
        path.normalize('path/to/dir2/test.txt'),
        path.normalize('path/to/dir2/test2.txt'),
        path.normalize('path/to/dir2/test3.txt')
      ];

      t.deepEqual(data, [new Set(arr)]);
      t.end();
    });
  });

  test('Call readRecursiveFolders with BAD Path Strings Array', (t: any) => {
    t.plan(1);

    const rslt = Promise.resolve(utils.recursiveFolders(['path/to/dir']));
    rslt.then(data => {
      t.deepEqual(data, [new Set()]);
      t.end();
    });
  });

  // readFile
  test('Call readFile with GOOD(File) Arg1(String)', (t: any) => {
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

  test('Call readFile with BAD(FILE) Arg1(String)', (t: any) => {
    t.plan(1);

    const rslt = Promise.resolve(utils.readFile('path/to/dir/test.tx'));
    rslt.then(data => {
      t.deepEqual(data, []);
      t.end();
    });
  });

  test('Call readFile with GOOD(FILE) Arg1(String / EMPTY)', (t: any) => {
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

  test('Call readFile with BAD(FOLDER) Arg1(String)', (t: any) => {
    t.plan(1);

    const rslt = Promise.resolve(utils.readFile(__dirname));
    rslt.then(data => {
      t.deepEqual(data, []);
      t.end();
    });
  });

  // checkMD5
  test('Call checkMD5 with GOOD(FILE) Arg1(String) = with GOOD(FILE) Arg2(String)', (t: any) => {
    const mock = require('mock-fs');
    t.plan(1);

    mock({
      'path/to/dir': {
        'test.txt': 'file contents here : This is the line 2',
        'test1.txt': 'file contents here : This is the line 2'
      }
    });


    const rslts = Promise.all([utils.readFile('path/to/dir/test.txt'), utils.readFile('path/to/dir/test1.txt')]);
    rslts.then(r => {
      const mapSource = new Map<string, string>();
      const mapCompare = new Map<string, string>();
      r[0].map(line => mapSource.set(line.split(' : ')[1], line.split(' : ')[0]));
      r[1].map(line => mapCompare.set(line.split(' : ')[1], line.split(' : ')[0]));
      const rslt = Promise.resolve(utils.checkMD5(mapSource, mapCompare));
      rslt.then(data => {
        mock.restore();
        t.deepEqual(data, true);
        t.end();
      });
    });
  });

  test('Call checkMD5 with GOOD(FILE) Arg1(String) != with GOOD(FILE) Arg2(String)', (t: any) => {
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
      const mapSource = new Map<string, string>();
      const mapCompare = new Map<string, string>();
      r[0].map(line => mapSource.set(line.split(' : ')[1], line.split(' : ')[0]));
      r[1].map(line => mapCompare.set(line.split(' : ')[1], line.split(' : ')[0]));
      const rslt = Promise.resolve(utils.checkMD5(mapSource, mapCompare));
      rslt.then(data => {
        mock.restore();
        t.deepEqual(data, true);
        t.end();
      });
    });
  });

  // compareMD5
  test('Call compareMD5 with BAD(FILE) Arg1(String) != with GOOD(FILE) Arg2(String)', (t: any) => {
    const mock = require('mock-fs');
    t.plan(1);

    mock({
      'path/to/dir': {
        'test.txt': '11111 : This is the line 2',
        'test1.txt': '111112: his is the line 2'
      }
    });

    const rslt = Promise.resolve(utils.compareMD5('path/to/dir/test3.txt', 'path/to/dir/test.txt'));
    rslt.then(data => {
      mock.restore();
      t.true(data);
      t.end();
    });
  });

  test('Call compareMD5 with GOOD(FILE) Arg1(String) = with GOOD(FILE) Arg2(String)', (t: any) => {
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

  test('Call compareMD5 with GOOD(FILE) Arg1(String) != with GOOD(FILE) Arg2(String)', (t: any) => {
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

  test('Call compareMD5 with with GOOD(FILE) Arg1(String) != with BAD(FILE) Arg2(String)', (t: any) => {
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
      t.true(data);
      t.end();
    });
  });

  test('Call compareMD5 with BAD(FILE) Arg1(String) != with BAD(FILE) Arg2(String)', (t: any) => {
    t.plan(1);
    const rslt = Promise.resolve(utils.compareMD5('path/to/dir/test3.txt', 'path/to/dir/test3.txt'));
    rslt.then(data => {
      t.true(data);
      t.end();
    });
  });

  test('Call compareMD5 with BAD(FOLDER) Arg1(String) != with BAD(FOLDER) Arg2(String)', (t: any) => {
    t.plan(1);
    const rslt = Promise.resolve(utils.compareMD5(__dirname, __dirname));
    rslt.then(data => {
      t.true(data);
      t.end();
    });
  });

  // analyseMD5
  test('Call analyseMD5 with GOOD(FILE) Arg1(String) != with GOOD(FILES) Arg2(Array) ADD_LINES', (t: any) => {
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
      const setSource = new Set<string>();
      r.map(line => setSource.add(line));
      const rslt = Promise.resolve(utils.analyseMD5('path/to/dir/test.txt', setSource));
      rslt.then(data => {
        mock.restore();
        const arr = ['file contents : here', 'Tis is the : line 2'];
        const arr2 = ['here', 'line 2'];
        t.deepEqual(data, {getNewFilesToAddSet: new Set(arr), getFilesToRemoveSet: new Set(arr2)});
        t.end();
      });
    });
  });

  test('Call analyseMD5 with GOOD(FILE) Arg1(String) != with GOOD(FILES) Arg2(Array)  REMOVE_LINES', (t: any) => {
    const mock = require('mock-fs');
    t.plan(1);

    mock({
      'path/to/dir': {
        'test.txt': '1111111111 : line 1\n2222222222é : line 2',
        'test1.txt': '1111111111111111111111 : line 1'
      }
    });

    const rsltPromise = Promise.resolve(utils.readFile('path/to/dir/test1.txt'));
    rsltPromise.then(r => {
      const setSource = new Set<string>();
      r.map(line => setSource.add(line));
      const rslt = Promise.resolve(utils.analyseMD5('path/to/dir/test.txt', setSource, false));
      rslt.then(data => {
        mock.restore();
        const arr = ['1111111111111111111111 : line 1'];
        const arr2 = ['line 1', 'line 2'];
        t.deepEqual(data, {getNewFilesToAddSet: new Set(arr), getFilesToRemoveSet: new Set(arr2)});
        t.end();
      });
    });
  });

  test('Call analyseMD5 with GOOD(FILE) Arg1(String) != with GOOD(FILES) Arg2(Array) AND Arg3(Boolean / True) ADD_REMOVE_LINES', (t: any) => {
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
      const setSource = new Set<string>();
      r.map(line => setSource.add(line));
      const rslt = Promise.resolve(utils.analyseMD5('path/to/dir/test1.txt', setSource, true));
      rslt.then(data => {
        mock.restore();
        const arr = ['This is the line 2'];
        const arr2 = ['1234567 : Ths is the line 2'];
        t.deepEquals(data, {getFilesToRemoveSet : new Set(arr), getNewFilesToAddSet: new Set(arr2)});
        t.end();
      });
    });
  });

  test('Call analyseMD5 with BAD(FILE) Arg1(String) != with GOOD(FILES) Arg2(Array)', (t: any) => {
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
      const setSource = new Set<string>();
      r.map(line => setSource.add(line));
      const rslt = Promise.resolve(utils.analyseMD5('path/to/dir/test3.txt', setSource));
      rslt.then(data => {
        mock.restore();
        const arr = ['file contents here', 'This is the line 2'];
        t.deepEquals(data, {getFilesToRemoveSet : new Set(), getNewFilesToAddSet: new Set(arr)});
        t.end();
      });
    });
  });

  // quickDumpMD5FileDest
  test('Call quickDumpMD5FileDest with GOOD(FILES) Arg1(Array) != with GOOD(FILE) Arg2(String)', (t: any) => {
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
        t.deepEqual(data, true);
        t.end();
      });
    });
  });

  test('Call quickDumpMD5FileDest with GOOD(FILES) Arg1(Array) != with BAD(FILE) Arg2(String)', (t: any) => {
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

  // naturalCompare
  test('Call naturalCompare with Line 1 < Line 2 (String)', (t: any) => {
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

  test('Call naturalCompare with Line 2 < Line 1 (String)', (t: any) => {
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

  test('Call naturalCompare with Line 2(String) = Line 1 (String)', (t: any) => {
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

  // sortFileDest
  test('Call sortFileDest with GOOD(FILE) Arg1(String)', (t: any) => {
    const mock = require('mock-fs');
    t.plan(1);

    mock({
      'path/to/dir': {
        'test.txt': '11111 : This is the line 1\n2222222 : This is the line 2',
        'test2.txt': '11111 : This is the line 1\n2222222 : This is the line 2'
      }
    });

    const rslt = Promise.resolve(utils.sortFileDest('path/to/dir/test2.txt'));
    rslt.then(data => {
      mock.restore();
      t.deepEqual(data, [ '11111 : This is the line 1', '2222222 : This is the line 2' ]);
      t.end();
    });
  });

  test('Call sortFileDest with BAD(FILE) Arg1(String)', (t: any) => {
    t.plan(1);

    const rslt = Promise.resolve(utils.sortFileDest('null'));
    rslt.then(data => {
      t.deepEqual(data, []);
      t.end();
    });
  });

  test('Call sortFileDest with BAD(FOLDER) Arg1(String)', (t: any) => {
    t.plan(1);

    const rslt = Promise.resolve(utils.sortFileDest(__dirname));
    rslt.then(data => {
      t.deepEqual(data, []);
      t.end();
    });
  });

  test('Call writeMD5FileDest with GOOD(FILE) Arg1(Array) AND GOOD(FILE) Arg2(Array)', (t: any) => {
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
      const setSource = new Set<string>();
      r.map(line => setSource.add(line));
      const rslt = Promise.resolve(utils.writeMD5FileDest(setSource, setSource));
      rslt.then(data => {
        mock.restore();
        t.true(data);
        t.end();
      });
    });
  });
})();
