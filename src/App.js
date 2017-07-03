import { h, Component } from 'preact';
import { Provider } from 'preact-redux';
import Router from 'preact-router';

import firebase from 'firebase';

import store from './store';
import Home from './containers/Home';
import { config } from './config';

import './App.css';

firebase.initializeApp(config.firebase);

export default class App extends Component {
  render() {
    return (<Provider store={store}>
      <Router>
        <Home path="/" />
        <Home path="/recently" />
        <Home path="/trending" />
      </Router>
    </Provider>);
  }
}
