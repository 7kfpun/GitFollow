import { h, Component } from 'preact';
import Octicon from 'react-octicon';

import firebase from 'firebase';

import './Landing.css';

export default class Landing extends Component {
  toggleSignIn() {
    console.log('Click');
    if (!firebase.auth().currentUser) {
      const provider = new firebase.auth.GithubAuthProvider();

      provider.addScope('user:email,user:follow');

      firebase.auth().signInWithPopup(provider).then((result) => {
        console.log('Auth result', result);
        location.reload();  // eslint-disable-line no-undef
      }).catch((error) => {
        console.error(error);
      });
    } else {
      firebase.auth().signOut();
      location.reload();  // eslint-disable-line no-undef
    }
  }

  render() {
    return (<div className="Landing">
      <div className="Landing-background">
        <div className="Landing-text">
          <span className="Landing-text-title">Easiest way to follow Git</span>
          <span className="Landing-text-description">
            <span className="Landing-text-highlight">GitFollow </span>
              is a site to get close with all great organizations.<br />
              Search, follow and keep track of your favourite organizations.
          </span>
          <div>
            <button className="Landing-button btn btn-primary" onClick={() => this.toggleSignIn()}>
              LOGIN WITH <Octicon className="Landing-button-icon" name="mark-github" />
            </button>
          </div>
        </div>
      </div>
    </div>);
  }
}
