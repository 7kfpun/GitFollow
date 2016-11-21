import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardActions } from 'material-ui/Card';

import firebase from 'firebase';
import store from 'store2';

const styles = {
  container: {
    marginTop: 70,
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
      open: this.props.open,
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
          open: false,
        });
        store('accessToken', result.credential.accessToken);
        this.props.AuthStore.setAccessToken(result.credential.accessToken);
        location.reload();  // eslint-disable-line no-undef
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
        onTouchTap={() => this.props.AuthStore.closeLoginDialog()}
      />,
      <FlatButton
        label="Login with Github"
        primary={true}
        onTouchTap={() => this.toggleSignIn()}
      />,
    ];

    return (
      <div style={styles.container}>
        <Card>
          <h4 style={{ paddingTop: 50 }}>Welcome to GitFollow</h4>
          <p>Add ability to follow organizations like a user</p>
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
          title="Login with your Github Account"
          actions={actions}
          onRequestClose={() => this.props.AuthStore.closeLoginDialog()}
          modal={true}
          open={this.props.open}
        >
          {'Let\'s login with your GitHub account and start following organizations you like.'}
        </Dialog>
      </div>
    );
  }
}

Login.propTypes = {
  AuthStore: React.PropTypes.shape({
    setAccessToken: React.PropTypes.func,
    setUserInfo: React.PropTypes.func,
    closeLoginDialog: React.PropTypes.func,
  }),
  open: React.PropTypes.bool,
};
