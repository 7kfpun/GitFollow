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

import SearchBar from './components/search-bar';

import './App.css';

const styles = {
  container: {
    margin: 50,
    padding: 50,
  },
  avatar: {
    backgroundColor: 'white',
  },
  loginBlock: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snackbarOpen: false,
      isLoading: true,
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
        <div className="App-content">
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
                {this.props.AuthStore.accessToken && <MenuItem
                  primaryText="Sign Out"
                  onTouchTap={() => {
                    firebase.auth().signOut();
                    location.reload();  // eslint-disable-line no-undef
                  }}
                />}
              </IconMenu>
            </ToolbarGroup>
          </Toolbar>

          <video autoPlay loop id="video-background" muted>
            <source src="./Love-Coding.mp4" type="video/mp4" />
          </video>

          <div style={styles.loginBlock}>
            <p>What is GitFollow?</p>
          </div>
        </div>


        <div style={{ backgroundColor: 'black', padding: 50 }}>
          <h4 style={{ color: 'white' }}>{'Made with <3 in Hong Kong'}</h4>
        </div>

        <Snackbar
          open={this.state.snackbarOpen}
          message="Sorry, not impremented yet ;)"
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
  }),
  accessToken: React.PropTypes.string,
};

export default observer(['AuthStore'], App);
