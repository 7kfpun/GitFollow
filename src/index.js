import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { Provider } from 'mobx-react';

import firebase from 'firebase';

import App from './App';
import Landing from './Landing';
import AuthStore from './store/authStore';

import './index.css';

const config = {
  apiKey: 'AIzaSyDMTCNj5Xa_O4VmNOFncN2qCd0ml_gHbV8',
  authDomain: 'gitfollow.firebaseapp.com',
  databaseURL: 'https://gitfollow.firebaseio.com',
  storageBucket: 'gitfollow.appspot.com',
  messagingSenderId: '1014685065269',
};
firebase.initializeApp(config);

injectTapEventPlugin();

const stores = { AuthStore };

ReactDOM.render(
  <MuiThemeProvider>
    <Provider {...stores}>
      <Router history={browserHistory}>
        <Route path="/" component={App} />
        <Route path="/landing" component={Landing} />
      </Router>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')  // eslint-disable-line no-undef
);
