const test = require('tape');

test('Date is a function', t => {
  t.plan(1);
  t.equal(typeof Date.now, 'function');
});
