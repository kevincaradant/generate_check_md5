const checks = require('./checks.js');
const test = require('tape');
const path = require('path');

// CheckHelp
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

// checkAllParamsFromUser
test('Call checkAllParamsFromUser with one bad params', t => {
  t.plan(1);
  const arrayUserParams = ['p1', 'p2', 'p4'];
  const arrayAuthorizeParams = ['p1', 'p2', 'p3'];
  t.false(checks.checkAllParamsFromUser(arrayAuthorizeParams, arrayUserParams));
  t.end();
});

test('Call checkAllParamsFromUser with all good params', t => {
  t.plan(1);
  const arrayUserParams = ['p1', 'p2', 'p3'];
  const arrayAuthorizeParams = ['p1', 'p2', 'p3'];
  t.true(checks.checkAllParamsFromUser(arrayAuthorizeParams, arrayUserParams));
  t.end();
});

// isExistAtLeastOneParamFromUser
test('Call isExistAtLeastOneParamFromUser with one bad params', t => {
  t.plan(1);
  const arrayUserParams = ['p1', 'p2', 'p4'];
  const arrayAuthorizeParams = ['p1', 'p2', 'p3'];
  t.true(checks.isExistAtLeastOneParamFromUser(arrayAuthorizeParams, arrayUserParams));
  t.end();
});

test('Call isExistAtLeastOneParamFromUser with one good params', t => {
  t.plan(1);
  const arrayUserParams = ['p1', 'p5', 'p4'];
  const arrayAuthorizeParams = ['p1', 'p2', 'p3'];
  t.true(checks.isExistAtLeastOneParamFromUser(arrayAuthorizeParams, arrayUserParams));
  t.end();
});

test('Call isExistAtLeastOneParamFromUser with all bad params', t => {
  t.plan(1);
  const arrayUserParams = ['p4', 'p5', 'p6'];
  const arrayAuthorizeParams = ['p1', 'p2', 'p3'];
  t.false(checks.isExistAtLeastOneParamFromUser(arrayAuthorizeParams, arrayUserParams));
  t.end();
});

test('Call isExistAtLeastOneParamFromUser with all good params', t => {
  t.plan(1);
  const arrayUserParams = ['p1', 'p2', 'p3'];
  const arrayAuthorizeParams = ['p1', 'p2', 'p3'];
  t.true(checks.isExistAtLeastOneParamFromUser(arrayAuthorizeParams, arrayUserParams));
  t.end();
});

// isPathCorrect
test('Call isPathCorrect with a path argument without any path', t => {
  t.plan(1);
  t.false(checks.isPathCorrect());
  t.end();
});

test('Call isPathCorrect with a path argument without string path', t => {
  t.plan(1);
  t.false(checks.isPathCorrect(12));
  t.end();
});

test('Call isPathCorrect with a argument with a bad string path', t => {
  t.plan(1);
  const rslt = Promise.resolve(checks.isPathCorrect('null'));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

test('Call isPathCorrect with a argument with a good path', t => {
  t.plan(1);
  const rslt = Promise.resolve(checks.isPathCorrect(__dirname));
  rslt.then(data => {
    t.true(data);
    t.end();
  });
});

test('Call isPathCorrect with a argument with a file path', t => {
  t.plan(1);
  const rslt = Promise.resolve(checks.isPathCorrect(path.join(__dirname, '/checks.spec.js')));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

// isDestCorrect
test('Call isDestCorrect with a dest argument without path', t => {
  t.plan(1);
  t.true(checks.isDestCorrect());
  t.end();
});

// isDestCorrect
test('Call isDestCorrect with a dest argument without string path', t => {
  t.plan(1);
  t.false(checks.isDestCorrect(12));
  t.end();
});

test('Call isDestCorrect with a argument with a bad string path', t => {
  t.plan(1);
  const rslt = Promise.resolve(checks.isDestCorrect(path.join(__dirname, '/test.txt')));
  rslt.then(data => {
    t.true(data);
    t.end();
  });
});

test('Call isDestCorrect with a argument with a good path', t => {
  t.plan(1);
  const rslt = Promise.resolve(checks.isDestCorrect(path.join(__dirname, '/checks.spec.js')));
  rslt.then(data => {
    t.true(data);
    t.end();
  });
});

test('Call isDestCorrect with a argument with a folder path', t => {
  t.plan(1);
  const rslt = Promise.resolve(checks.isDestCorrect(__dirname));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

// isSourceCorrect
test('Call isSourceCorrect with a source argument without path', t => {
  t.plan(1);
  t.false(checks.isSourceCorrect());
  t.end();
});

test('Call isSourceCorrect with a source argument without string path', t => {
  t.plan(1);
  t.false(checks.isSourceCorrect(12));
  t.end();
});

test('Call isSourceCorrect with a argument with a bad string path', t => {
  t.plan(1);
  const rslt = Promise.resolve(checks.isSourceCorrect('null'));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

test('Call isSourceCorrect with a argument with a good path', t => {
  t.plan(1);
  const rslt = Promise.resolve(checks.isSourceCorrect(path.join(__dirname, '/checks.spec.js')));
  rslt.then(data => {
    t.true(data);
    t.end();
  });
});

test('Call isSourceCorrect with a argument with a folder path', t => {
  t.plan(1);
  const rslt = Promise.resolve(checks.isSourceCorrect(__dirname));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

// isCompareCorrect
test('Call isCompareCorrect with a compare argument without  path', t => {
  t.plan(1);
  t.false(checks.isCompareCorrect());
  t.end();
});

test('Call isCompareCorrect with a compare argument without string path', t => {
  t.plan(1);
  t.false(checks.isCompareCorrect(12));
  t.end();
});

test('Call isCompareCorrect with a argument with a bad string path', t => {
  t.plan(1);
  const rslt = Promise.resolve(checks.isCompareCorrect('null'));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

test('Call isCompareCorrect with a argument with a good path', t => {
  t.plan(1);
  const rslt = Promise.resolve(checks.isCompareCorrect(path.join(__dirname, '/checks.spec.js')));
  rslt.then(data => {
    t.true(data);
    t.end();
  });
});

test('Call isCompareCorrect with a argument with a folder path', t => {
  t.plan(1);
  const rslt = Promise.resolve(checks.isCompareCorrect(__dirname));
  rslt.then(data => {
    t.false(data);
    t.end();
  });
});

// showPathError
test('Call showPathError with a argument at true', t => {
  t.plan(1);
  t.true(checks.showPathError(true));
  t.end();
});

test('Call showPathError with a argument at false', t => {
  t.plan(1);
  t.false(checks.showPathError(false));
  t.end();
});

// showDestError
test('Call showDestError with a argument at true', t => {
  t.plan(1);
  t.true(checks.showDestError(true));
  t.end();
});

// showSourceError
test('Call showSourceError with a argument at true', t => {
  t.plan(1);
  t.true(checks.showSourceError(true));
  t.end();
});

test('Call showSourceError with a argument at false', t => {
  t.plan(1);
  t.false(checks.showSourceError(false));
  t.end();
});

// showCompareError
test('Call showCompareError with a argument at true', t => {
  t.plan(1);
  t.true(checks.showCompareError(true));
  t.end();
});

test('Call showCompareError with a argument at false', t => {
  t.plan(1);
  t.false(checks.showCompareError(false));
  t.end();
});

// showRewriteUpdateError
test('Call showRewriteUpdateError with two args at true', t => {
  t.plan(1);
  t.false(checks.showRewriteUpdateError(true, true));
  t.end();
});

test('Call showRewriteUpdateError with the first argument at true and the second argument at false', t => {
  t.plan(1);
  t.true(checks.showRewriteUpdateError(true, false));
  t.end();
});

test('Call showRewriteUpdateError with the first argument at false and the second argument at true', t => {
  t.plan(1);
  t.true(checks.showRewriteUpdateError(false, true));
  t.end();
});

test('Call showRewriteUpdateError with two args at false', t => {
  t.plan(1);
  t.true(checks.showRewriteUpdateError(false, false));
  t.end();
});
