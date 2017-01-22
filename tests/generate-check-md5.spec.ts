  const test = require('tape');
  import * as checks from '../src/checks';
(() => {
  test('Date is a function', (t: any) => {
      t.plan(1);
      t.false(checks.checkHelp(true, false));
      t.end();
  });
})();
