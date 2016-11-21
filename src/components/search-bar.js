import React, { Component } from 'react';
import AutoComplete from 'material-ui/AutoComplete';

import firebase from 'firebase';

export default class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],
      results: [],
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
    firebase.database().ref(`following/${uid}`).child(organization.id).set({
      id: organization.id,
      avatar_url: organization.avatar_url,
      login: organization.login,
      html_url: organization.html_url,
      site_admin: organization.site_admin,
      type: organization.type,
      timestamp: new Date().getTime(),
    });
  }

  render() {
    return (
      <AutoComplete
        hintText={'Add more organizations...'}
        dataSource={this.state.dataSource}
        onUpdateInput={value => this.handleUpdateInput(value)}
        onNewRequest={value => this.handleNewRequest(value)}
        maxSearchResults={10}
      />
    );
  }
}

SearchBar.propTypes = {
  accessToken: React.PropTypes.string,
  uid: React.PropTypes.string,
};
