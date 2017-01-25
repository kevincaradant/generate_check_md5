import * as utils from '../src/utils';
const test = require('tape');
const path = require('path');
const isEqual = require('is-equal');

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

  test('Call readFile without Arg1', (t: any) => {
    t.plan(1);

    const rslt = Promise.resolve(utils.readFile());
    rslt.then(data => {
      t.deepEqual(data, []);
      t.end();
    });
  });

  test('Call readFile with GOOD(FILE) Arg1(String => EMPTY)', (t: any) => {
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




  // _isPresentMD5FromCompareToSource
  test('Call _isPresentMD5FromCompareToSource with GOOD(FILE) Arg1(String) = with GOOD(FILE) Arg2(String)', (t: any) => {
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
      const rslt = Promise.resolve(utils._isPresentMD5FromCompareToSource(mapSource, mapCompare));
      rslt.then(data => {
        mock.restore();
        t.true(data);
        t.end();
      });
    });
  });

  test('Call _isPresentMD5FromCompareToSource with GOOD(FILE) Arg1(String) != with GOOD(FILE) Arg2(String)', (t: any) => {
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
      const rslt = Promise.resolve(utils._isPresentMD5FromCompareToSource(mapSource, mapCompare));
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

  test('Call compareMD5 without Arg1 and Arg2', (t: any) => {
    t.plan(1);
    const rslt = Promise.resolve(utils.compareMD5());
    rslt.then(data => {
      t.true(data);
      t.end();
    });
  });

  test('Call compareMD5 with bad parsing Arg1 and Arg2', (t: any) => {
    const mock = require('mock-fs');
    t.plan(1);

    mock({
      'path/to/dir': {
        'test.txt': 'a : b',
        'test1.txt': 'z : b'
      }
    });

    const rslt = Promise.resolve(utils.compareMD5('path/to/dir/test.txt', 'path/to/dir/test1.txt'));
    rslt.then(data => {
      mock.restore();
      t.true(data);
      t.end();
    });
  });




  // updateMD5
  test('Call updateMD5 with GOOD(FILE) Arg1(String) != with GOOD(FILES) Arg2(Array) ADD_LINES', (t: any) => {
    const mock = require('mock-fs');
    t.plan(1);

    mock({
      'path/to/dir': {
        'test.txt': 'md5 : here1\nmd53: line 22',
        'test1.txt': 'md51 : here\nmd56 : line 2'
      }
    });

    const rsltPromise = Promise.resolve(utils.readFile('path/to/dir/test1.txt'));
    rsltPromise.then(r => {
      const setSource = new Set<string>();
      r.map(line => setSource.add(line));
      const rslt = Promise.resolve(utils.updateMD5('path/to/dir/test.txt', setSource));
      rslt.then(data => {
        mock.restore();
        const arr = ['md51 : here', 'md56 : line 2'];
        const arr2 = ['here1'];
        t.ok(isEqual(data, { getNewFilesToAdd: new Set(arr), getFilesToRemove: new Set(arr2) }));
        t.end();
      });
    });
  });

  test('Call updateMD5 with GOOD(FILE) Arg1(String) != with GOOD(FILES) Arg2(Array)  REMOVE_LINES', (t: any) => {
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
      const rslt = Promise.resolve(utils.updateMD5('path/to/dir/test.txt', setSource, false));
      rslt.then(data => {
        mock.restore();
        const arr = ['1111111111111111111111 : line 1'];
        const arr2 = ['line 1', 'line 2'];
        t.ok(isEqual(data, { getNewFilesToAdd: new Set(arr), getFilesToRemove: new Set(arr2) }));
        t.end();
      });
    });
  });

  test('Call updateMD5 with GOOD(FILE) Arg1(String) != with GOOD(FILES) Arg2(Array) AND Arg3(Boolean / True) ADD_REMOVE_LINES', (t: any) => {
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
      const rslt = Promise.resolve(utils.updateMD5('path/to/dir/test1.txt', setSource, true));
      rslt.then(data => {
        mock.restore();
        const arr = ['This is the line 2'];
        const arr2 = ['1234567 : Ths is the line 2'];
        t.ok(isEqual(data, { getFilesToRemove: new Set(arr), getNewFilesToAdd: new Set(arr2) }));
        t.end();
      });
    });
  });

  test('Call updateMD5 with BAD(FILE) Arg1(String) != with GOOD(FILES) Arg2(Array)', (t: any) => {
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
      const rslt = Promise.resolve(utils.updateMD5('path/to/dir/test3.txt', setSource));
      rslt.then(data => {
        mock.restore();
        const arr = ['file contents here', 'This is the line 2'];
        t.ok(isEqual(data, { getFilesToRemove: new Set(), getNewFilesToAdd: new Set(arr) }));
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

  test('Call quickDumpMD5FileDest with GOOD(FILES) Arg1(Array) and without Arg2(String)', (t: any) => {
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
      const data = utils.quickDumpMD5FileDest(r);
      mock.restore();
      t.false(data);
      t.end();
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
      t.deepEqual(data, ['11111 : This is the line 1', '2222222 : This is the line 2']);
      t.end();
    });
  });




  // _getFilesToRemove
  test('Call _getFilesToRemove with Arg1(Set<string>) without Arg2', (t: any) => {
    t.plan(1);
    const data = utils._getFilesToRemove(new Set<string>());
    t.ok(data);
    t.end();
  });

  test('Call _getFilesToRemove witha empty Arg1(Set)  and with a Good Arg2(string)', (t: any) => {
    const mock = require('mock-fs');
    t.plan(1);

    mock({
      'path/to/dir': {
        'test.txt': '11111 : This is the line 1\n2222222 : This is the line 2',
        'test2.txt': '11111 : This is the line 1\n2222222 : This is the line 2'
      }
    });

    const data = utils._getFilesToRemove(new Set<string>(), 'path/to/dir/test2.txt');
    mock.restore();
    t.ok(data);
    t.end();
  });

  test('Call _getFilesToRemove with Arg1(Set<String>) and with a Good Arg2(string)', (t: any) => {
    const mock = require('mock-fs');
    t.plan(1);

    mock({
      'path/to/dir': {
        'test.txt': '684db2a81c508aa1d4b0c3fc8388b7f5 : This is the line 1\n684db2a81c508aa1d4b0c3fc8388b7f5 : This is the line 2',
        'test2.txt': '684db2a81c508aa1d4b0c3fc8388b7f5 : This is the line 1\n684db2a81c508aa1d4b0c3fc8388b7f5 : This is the line 2'
      }
    });

    let setFiles = new Set<string>();
    setFiles.add('path/to/dir/test.txt');
    setFiles.add('path/to/dir/test2.txt');

    const data = utils._getFilesToRemove(setFiles, 'path/to/dir/test2.txt');
    mock.restore();
    t.ok(data);
    t.end();
  });




  // _getFilesToAdd
  test('Call _getFilesToAdd with Arg1(Set<string>) without Arg2 Arg3', (t: any) => {
    t.plan(1);
    const data = utils._getFilesToAdd(new Set<string>());
    t.ok(data);
    t.end();
  });

  test('Call _getFilesToAdd witha empty Arg1(Set) without Arg3 and with a Good Arg2(string)', (t: any) => {
    const mock = require('mock-fs');
    t.plan(1);

    mock({
      'path/to/dir': {
        'test.txt': '11111 : This is the line 1\n2222222 : This is the line 2',
        'test2.txt': '11111 : This is the line 1\n2222222 : This is the line 2'
      }
    });

    const data = utils._getFilesToAdd(new Set<string>(), 'path/to/dir/test2.txt');
    mock.restore();
    t.ok(data);
    t.end();
  });

  test('Call _getFilesToAdd with Arg1(empty Set) and with Arg3(true) and with a Good Arg2(string)', (t: any) => {
    const mock = require('mock-fs');
    t.plan(1);

    mock({
      'path/to/dir': {
        'test.txt': '11111 : This is the line 1\n2222222 : This is the line 2',
        'test2.txt': '11111 : This is the line 1\n2222222 : This is the line 2'
      }
    });

    const data = utils._getFilesToAdd(new Set<string>(), 'path/to/dir/test2.txt', true);
    mock.restore();
    t.ok(data);
    t.end();
  });

  test('Call _getFilesToAdd with Arg1(Set<String>) and with Arg3(true) and with a Good Arg2(string)', (t: any) => {
    const mock = require('mock-fs');
    t.plan(1);

    mock({
      'path/to/dir': {
        'test.txt': '11111 : This is the line 1\n2222222 : This is the line 2',
        'test2.txt': '11111 : This is the line 1\n2222222 : This is the line 2'
      }
    });

    let setFiles = new Set<string>();
    setFiles.add('path/to/dir/test.txt');
    setFiles.add('path/to/dir/test2.txt');

    const data = utils._getFilesToAdd(setFiles, 'path/to/dir/test2.txt', true);
    mock.restore();
    t.ok(data);
    t.end();
  });

  test('Call _getFilesToAdd with Arg1(Set<String>) and without Arg3 and Arg2', (t: any) => {
    const mock = require('mock-fs');
    t.plan(1);

    mock({
      'path/to/dir': {
        'test.txt': '11111 : This is the line 1\n2222222 : This is the line 2',
        'test2.txt': '11111 : This is the line 1\n2222222 : This is the line 2'
      }
    });

    let setFiles = new Set<string>();
    setFiles.add('path/to/dir/test.txt');
    setFiles.add('path/to/dir/test2.txt');

    const data = utils._getFilesToAdd(setFiles);
    mock.restore();
    t.ok(data);
    t.end();
  });




  // sortFileDest
  test('Call sortFileDest without Arg1', (t: any) => {
    t.plan(1);
    const rslt = Promise.resolve(utils.sortFileDest());
    rslt.then(data => {
      t.deepEqual(data, []);
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




  // writeMD5FileDest
  test('Call writeMD5FileDest with GOOD(FILE) Arg1(Array) AND GOOD(FILE) Arg2(Array) without Arg5(File)', (t: any) => {
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

  test('Call writeMD5FileDest with GOOD(FILE) Arg1(Array) AND GOOD(FILE) Arg2(Array) with Argv5 Dest File', (t: any) => {
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
      const rslt = Promise.resolve(utils.writeMD5FileDest(setSource, setSource, false, false, 'path/to/dir/test.txt'));
      rslt.then(data => {
        mock.restore();
        t.true(data);
        t.end();
      });
    });
  });
})();
