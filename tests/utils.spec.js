const utils = require('./utils.js');
const test = require('tape');

// findElemInArray
test('Call findElemInArray with two same arrays', t => {
  t.plan(1);
  const arrayElements1 = ['p1', 'p2', 'p3'];
  const arrayElements2 = ['p1', 'p2', 'p3'];
  t.true(utils.findElemInArray(arrayElements1, arrayElements2));
  t.end();
});

test('Call findElemInArray with two different arrays (1 element is diff)', t => {
  t.plan(1);
  const arrayElements1 = ['p1', 'p2', 'p4'];
  const arrayElements2 = ['p1', 'p2', 'p3'];
  t.false(utils.findElemInArray(arrayElements1, arrayElements2));
  t.end();
});

test('Call findElemInArray with two different arrays (all elements are diff)', t => {
  t.plan(1);
  const arrayElements1 = ['p11', 'p22', 'p4'];
  const arrayElements2 = ['p1', 'p2', 'p3'];
  t.false(utils.findElemInArray(arrayElements1, arrayElements2));
  t.end();
});

// findAtLeastOneElemInArray
test('Call findAtLeastOneElemInArray with two same arrays', t => {
  t.plan(1);
  const arrayElements1 = ['p1', 'p2', 'p3'];
  const arrayElements2 = ['p1', 'p2', 'p3'];
  t.true(utils.findAtLeastOneElemInArray(arrayElements1, arrayElements2));
  t.end();
});

test('Call findAtLeastOneElemInArray with two different arrays (1 element is diff)', t => {
  t.plan(1);
  const arrayElements1 = ['p1', 'p2', 'p4'];
  const arrayElements2 = ['p1', 'p2', 'p3'];
  t.true(utils.findAtLeastOneElemInArray(arrayElements1, arrayElements2));
  t.end();
});

test('Call findAtLeastOneElemInArray with two different arrays (all elements are diff)', t => {
  t.plan(1);
  const arrayElements1 = ['p11', 'p33', 'p4'];
  const arrayElements2 = ['p1', 'p2', 'p3'];
  t.false(utils.findAtLeastOneElemInArray(arrayElements1, arrayElements2));
  t.end();
});
