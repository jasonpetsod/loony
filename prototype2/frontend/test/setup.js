// Largely copied from
// https://github.com/airbnb/enzyme/blob/f40dae8b975b6e2acf685af87b65a5fed3e89251/docs/guides/jsdom.md
// with some adjustments to pass lint.

const jsdom = require('jsdom').jsdom;

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js',
};
