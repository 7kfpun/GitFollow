import React, { Component } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import Snackbar from 'material-ui/Snackbar';

import firebase from 'firebase';

export default class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],
      results: [],
      snackbarOpen: false,
    };
  }

  handleUpdateInput(value) {
    if (value.length < 2) {
      return false;
    }

    const endpoint = 'users';
    const tempType = 'org';

    const that = this;
    let url = `https://api.github.com/search/${endpoint}?q=${value}+type:${tempType}`;
    if (this.props.accessToken) {
      url += `&access_token=${this.props.accessToken}`;
    }
    fetch(url)  // eslint-disable-line no-undef
      .then(response => response.json())
      .then((json) => {
        console.log(json);
        if (json && json.items && json.items.length > 0) {
          that.setState({
            dataSource: json.items.map(item => item.login),
            results: json.items,
          });
        } else if (json.message.indexOf('API rate limit') !== -1) {
          console.error('RATE LIMIT ERROR');
          that.props.AuthStore.openLoginDialog();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  handleNewRequest(value) {
    this.state.results.forEach((item) => {
      if (item.login === value) {
        this.followOrganization(item);
        return true;
      }
    });
  }

  followOrganization(organization) {
    console.log(organization.id, organization);
    this.setState({ isFollowed: true });

    const uid = this.props.uid;
    if (!uid) {
      this.props.AuthStore.openLoginDialog();
    }
    firebase.database().ref(`following/${uid}`).child(organization.id).set({
      id: organization.id,
      avatar_url: organization.avatar_url,
      login: organization.login,
      html_url: organization.html_url,
      site_admin: organization.site_admin,
      type: organization.type,
      timestamp: new Date().getTime(),
    });
    this.handleSnackbarOpen();
  }

  handleSnackbarOpen() {
    this.setState({
      snackbarOpen: true,
    });
  }

  handleRequestSnackbarClose() {
    this.setState({
      snackbarOpen: false,
    });
  }

  render() {
    return (
      <div>
        <AutoComplete
          hintText={'Search for more organizations...'}
          dataSource={this.state.dataSource}
          onUpdateInput={value => this.handleUpdateInput(value)}
          onNewRequest={value => this.handleNewRequest(value)}
          maxSearchResults={10}
        />
        <Snackbar
          open={this.state.snackbarOpen}
          message="Nice! You start following a great organization."
          autoHideDuration={4000}
          onRequestClose={() => this.handleRequestClose()}
        />
      </div>
    );
  }
}

SearchBar.propTypes = {
  accessToken: React.PropTypes.string,
  uid: React.PropTypes.string,
  AuthStore: React.PropTypes.shape({
    openLoginDialog: React.PropTypes.func,
  }),
};
