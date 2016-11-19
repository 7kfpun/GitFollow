import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardActions } from 'material-ui/Card';

import firebase from 'firebase';
import store from 'store2';

const styles = {
  container: {
    width: '80%',
    textAlign: 'center',
  },
};

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLogged: false,
      user: null,
      open: false,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('Logged', user);
        this.setState({ user, isLogged: true });

        this.props.AuthStore.setUserInfo(user.displayName, user.email, user.photoURL, user.uid);

        const s = store.get('accessToken');
        this.props.AuthStore.setAccessToken(s);

        // const s = store.get(`firebase:authUser:${user.i}:[DEFAULT]`);
        // console.log(s.stsTokenManager.accessToken);
        // if (s.stsTokenManager && s.stsTokenManager.accessToken) {
        //   this.props.AuthStore.setAccessToken(s.stsTokenManager.accessToken);
        // }

        // var displayName = user.displayName;
        // var email = user.email;
        // var emailVerified = user.emailVerified;
        // var photoURL = user.photoURL;
        // var isAnonymous = user.isAnonymous;
        // var uid = user.uid;
        // var providerData = user.providerData;
      } else {
        this.setState({ user: null, isLogged: false });
      }
    });
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  toggleSignIn() {
    if (!firebase.auth().currentUser) {
      const provider = new firebase.auth.GithubAuthProvider();

      provider.addScope('user');

      firebase.auth().signInWithPopup(provider).then((result) => {
        console.log('Auth result', result);
        this.setState({
          user: result.user,
          credential: result.credential,
        });
        store('accessToken', result.credential.accessToken);
        this.props.AuthStore.setAccessToken(result.credential.accessToken);
      }).catch((error) => {
        console.error(error);
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // const email = error.email;
        // const credential = error.credential;
        // if (errorCode === 'auth/account-exists-with-different-credential') {
        //   alert('You have already signed up with a different auth provider for that email.');
        // } else {
        //   console.error(error);
        // }
      });
    } else {
      firebase.auth().signOut();
    }
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={() => this.handleClose()}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        disabled={true}
        onTouchTap={() => this.handleClose()}
      />,
    ];

    return (
      <div style={styles.container}>
        <Card>
          <h4 style={{ paddingTop: 50 }}>Welcome to GitFollow</h4>
          <CardActions style={{ paddingBottom: 50, alignItems: 'center' }}>
            <RaisedButton
              label="Login with GitHub"
              primary
              style={styles.button}
              onTouchTap={() => this.toggleSignIn()}
            />
          </CardActions>
        </Card>

        <Dialog
          title="Dialog With Actions"
          actions={actions}
          onRequestClose={() => this.handleClose()}
          modal={true}
          open={this.state.open}
        >
          <div>
            {this.state.user && `Hi ${this.state.user.displayName} (${this.state.user.email})`}
            <RaisedButton label={!this.state.user ? 'SIGN IN' : 'SIGN OUT'} onTouchTap={() => this.toggleSignIn()} />
          </div>
        </Dialog>
      </div>
    );
  }
}

Login.propTypes = {
  AuthStore: React.PropTypes.shape({
    setAccessToken: React.PropTypes.func,
    setUserInfo: React.PropTypes.func,
  }),
};
