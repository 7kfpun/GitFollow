import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { Provider } from 'mobx-react';

import App from './App';
import AuthStore from './store/authStore';

import './index.css';

injectTapEventPlugin();

const stores = { AuthStore };

ReactDOM.render(
  <MuiThemeProvider>
    <Provider {...stores}>
      <Router history={browserHistory}>
        <Route path="/" component={App} />
      </Router>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
