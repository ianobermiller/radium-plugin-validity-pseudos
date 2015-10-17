var objectAssign = require('object-assign');
var test = require('tape');
var validityPseudosPlugin = require('./index');

function getBaseConfig() {
  var state = {};
  return {
    props: {},
    style: {
      ':invalid': {color: 'red'}
    },
    setState: function(key, value) {
      state[key] = value;
    },
    getState: function(key) {
      return state[key];
    },
    mergeStyles: function(styles) {
      return objectAssign.apply(null, [{}].concat(styles));
    },
  };
}

test('calls existing onChange', function(t) {
  t.plan(1);

  var isCalled = false;
  var config = objectAssign({}, getBaseConfig(), {
    props: {
      onChange: function() { isCalled = true; }
    },
    style: {
      ':invalid': {color: 'red'}
    },
  })

  var result = validityPseudosPlugin(config);

  result.props.onChange({target: {validity: {valid: true}}});

  t.equal(isCalled, true);
});

test('applies :valid styles by default', function(t) {
  t.plan(1);

  var config = objectAssign({}, getBaseConfig(), {
    style: {
      ':valid': {color: 'blue'}
    },
  })

  var result = validityPseudosPlugin(config);

  t.deepEqual(result.style, {color: 'blue'});
});

test('applies :invalid styles after onChange called', function(t) {
  t.plan(1);

  var config = objectAssign({}, getBaseConfig(), {
    style: {
      ':valid': {color: 'blue'},
      ':invalid': {color: 'red'}
    },
  })

  var result = validityPseudosPlugin(config);
  result.props.onChange({target: {validity: {valid: false}}});

  result = validityPseudosPlugin(config);

  t.deepEqual(result.style, {color: 'red'});
});

test('applies :valid styles after onChange called with valid', function(t) {
  t.plan(1);

  var config = objectAssign({}, getBaseConfig(), {
    style: {
      ':valid': {color: 'blue'},
      ':invalid': {color: 'red'}
    },
  })

  var result = validityPseudosPlugin(config);
  result.props.onChange({target: {validity: {valid: false}}});

  result = validityPseudosPlugin(config);
  result.props.onChange({target: {validity: {valid: true}}});

  result = validityPseudosPlugin(config);

  t.deepEqual(result.style, {color: 'blue'});
});

test('strips styles that don\'t apply', function(t) {
  t.plan(4);

  var config = objectAssign({}, getBaseConfig(), {
    style: {
      ':valid': {color: 'blue'},
      ':invalid': {color: 'red'}
    },
  })

  var result = validityPseudosPlugin(config);
  result.props.onChange({target: {validity: {valid: false}}});
  t.deepEqual(Object.keys(result.style), ['color']);

  result = validityPseudosPlugin(config);
  result.props.onChange({target: {validity: {valid: true}}});
  t.deepEqual(Object.keys(result.style), ['color']);

  result = validityPseudosPlugin(config);

  t.deepEqual(Object.keys(result.style), ['color']);
  t.deepEqual(result.style, {color: 'blue'});
});
