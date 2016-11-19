import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import Snackbar from 'material-ui/Snackbar';

import firebase from 'firebase';

import Login from './components/login';
import SearchBar from './components/search-bar';

import Organization from './components/organization';

import './App.css';

const config = {
  apiKey: 'AIzaSyDMTCNj5Xa_O4VmNOFncN2qCd0ml_gHbV8',
  authDomain: 'gitfollow.firebaseapp.com',
  databaseURL: 'https://gitfollow.firebaseio.com',
  storageBucket: 'gitfollow.appspot.com',
  messagingSenderId: '1014685065269',
};
firebase.initializeApp(config);

const styles = {
  container: {
    margin: 50,
    padding: 50,
  },
  avatar: {
    backgroundColor: 'white',
  },
  loginBlock: {
    paddingTop: 100,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snackbarOpen: false,
    };
  }

  handleSnackbarTouchTap() {
    this.setState({ snackbarOpen: true });
  }

  handleSnackbarRequestClose() {
    this.setState({ snackbarOpen: false });
  }

  render() {
    return (
      <div className="App">
        <Toolbar>
          <ToolbarGroup firstChild={true}><ToolbarTitle style={{ marginLeft: 50 }} text="Git Follow" /></ToolbarGroup>
          <ToolbarGroup>
            <SearchBar AuthStore={this.props.AuthStore} accessToken={this.props.AuthStore.accessToken} uid={this.props.AuthStore.uid} />
            <Avatar style={styles.avatar} src={this.props.AuthStore.photoURL} />
            <IconMenu
              iconButtonElement={
                <IconButton touch={true}>
                  <NavigationExpandMoreIcon />
                </IconButton>
              }
            >
              <MenuItem primaryText="About Us" onTouchTap={() => this.handleSnackbarTouchTap()} />
              <MenuItem primaryText="Sign Out" onTouchTap={() => firebase.auth().signOut()} />
            </IconMenu>
          </ToolbarGroup>
        </Toolbar>

        {this.props.AuthStore.accessToken && <div style={styles.container}>
          <Organization accessToken={this.props.AuthStore.accessToken} uid={this.props.AuthStore.uid} />
        </div>}

        {!this.props.AuthStore.accessToken && <div style={styles.loginBlock}>
          <Login AuthStore={this.props.AuthStore} accessToken={this.props.AuthStore.accessToken} open={this.props.AuthStore.isLoginNeeded} />
        </div>}

        <Snackbar
          open={this.state.snackbarOpen}
          message="Not impremented yet ;)"
          autoHideDuration={4000}
          onRequestClose={() => this.handleSnackbarRequestClose()}
        />
      </div>
    );
  }
}

App.propTypes = {
  AuthStore: React.PropTypes.shape({
    uid: React.PropTypes.string,
    accessToken: React.PropTypes.string,
    photoURL: React.PropTypes.string,
    isLoginNeeded: React.PropTypes.bool,
  }),
  accessToken: React.PropTypes.string,
};

export default observer(['AuthStore'], App);
