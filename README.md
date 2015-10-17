# radium-plugin-validity-pseudos

Radium plugin to enable the :valid and :invalid pseudo selectors."

Example:

```js
{
  ':valid': {borderColor: 'black'},
  ':invalid': {borderColor: 'red'}
}
```

## Usage

`radium-plugin-validity-pseudos` should be added directly before `Radium.Plugins.prefix`. Radium plugins are setup by passing a config object to `@Radium`. Since you'll probably want to use this plugin everywhere you use Radium, you can create your own module with a configured version of Radium:

`ConfiguredRadium.js`

```js
var Radium = require('radium');
var validityPseudosPlugin = require('radium-plugin-validity-pseudos');

function ConfiguredRadium(component) {
  return Radium({
    plugins: [
      Radium.Plugins.mergeStyleArray,
      Radium.Plugins.checkProps,
      Radium.Plugins.resolveMediaQueries,
      Radium.Plugins.resolveInteractionStyles,

      validityPseudosPlugin,

      Radium.Plugins.prefix,
      Radium.Plugins.checkProps,
    ]
  })(component);
}

module.exports = ConfiguredRadium;

```

Then you just use `@ConfiguredRadium` instead of `@Radium`. Or `ConfiguredRadium(MyComponent)` instead of `Radium(MyComponent)`.

```js
@ConfiguredRadium
class MyComponent extends Component {
  // ...
}
```
