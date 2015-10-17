var _isValiditySelector = function (styleFieldName) {
  return styleFieldName === ':valid' ||
    styleFieldName === ':invalid';
};

module.exports = function(config) {
  if (!Object.keys(config.style).some(_isValiditySelector)) {
    return;
  }

  var newProps = {};
  var existingOnChange = config.props.onChange;
  newProps.onChange = function (e) {
    existingOnChange && existingOnChange(e);
    var validValue = e.target && e.target.validity && e.target.validity.valid;
    var isValid = validValue !== false;
    config.setState(':valid', isValid);
  };

  // Merge the styles in the order they were defined
  var validityStyles = Object.keys(config.style)
    .filter(function(name) {
      // Defaults to true, since on first run it will be undefined
      var isComponentValid = config.getState(':valid') !== false;
      return _isValiditySelector(name) &&
        (name === ':valid') === isComponentValid;
    })
    .map(function (name) {
      return config.style[name];
    });

  var newStyle = config.mergeStyles([config.style].concat(validityStyles));

  // Remove validity styles
  newStyle = Object.keys(newStyle).reduce(
    function(styleWithoutValidityStyles, name) {
      if (!_isValiditySelector(name)) {
        styleWithoutValidityStyles[name] = newStyle[name];
      }
      return styleWithoutValidityStyles;
    },
    {}
  );

  return {
    style: newStyle,
    props: newProps
  };
};
