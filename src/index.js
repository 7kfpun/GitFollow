import { h, render } from 'preact';

import 'primer-css/build/build.css';

import './index.css';

if (process.env.NODE_ENV === 'development') {
  // Enable preact devtools
  require('preact/devtools');
}

let root;
function init() {
  const App = require('./App').default;
  root = render(<App />, document.querySelector('#app'), root);
}

if (module.hot) {
  module.hot.accept('./App', init);
}

init();
