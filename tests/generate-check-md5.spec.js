const test = require('tape');
const checks = require('./checks.js');

test('Date is a function', t => {
  t.plan(1);
  t.false(checks.checkHelp(true, false));
  t.end();
});
