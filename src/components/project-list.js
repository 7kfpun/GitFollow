import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import ActionUpdate from 'material-ui/svg-icons/action/update';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';

import firebase from 'firebase';
import moment from 'moment';

const MAXROWS = 4;

export default class ProjectList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isShowMore: false,
    };
  }

  componentDidMount() {
    const that = this;
    let url = `https://api.github.com/search/repositories?q=user:${this.props.organization.login}&sort=updated&order=desc`;
    if (this.props.accessToken) {
      url += `&access_token=${this.props.accessToken}`;
    }
    fetch(url)  // eslint-disable-line no-undef
      .then(response => response.json())
      .then((json) => {
        console.log('Repos', json);
        if (json && json.items) {
          that.setState({
            isLoading: false,
            repos: json.items,
          });
        }
      })
      .catch(err => console.error(err));
  }

  unfollowOrganization(organization) {
    const uid = this.props.uid;
    firebase.database().ref(`following/${uid}`).child(organization.id).set(null);
  }

  render() {
    if (this.state.isLoading) {
      return <CircularProgress size={30} style={{ marginLeft: 80 }} />;
    }

    let repos = [];
    if (this.state.repos) {
      const rows = this.state.isShowMore ? 100 : MAXROWS;
      repos = this.state.repos.slice(0, rows).map((item, i) => <ListItem
        key={i}
        href={item.html_url}
        target="_blank"
        primaryText={`${item.name}`}
        secondaryText={
          <p>
            <span style={{ color: 'black' }}>{item.description}</span><br />
            <span style={{ color: 'gray' }}>{item.language} {item.stargazers_count} {item.forks_count} {moment(item.updated_at).fromNow()}</span>
          </p>
        }
        secondaryTextLines={2}
        leftIcon={<ActionUpdate />}
      />);
    }

    return (
      <div>
        <List>{repos}</List>
        <FlatButton label={!this.state.isShowMore ? 'SHOW MORE' : 'SHOW LESS'} onTouchTap={() => this.setState({ isShowMore: !this.state.isShowMore })} />
        <FlatButton label={'UNFOLLOW'} labelStyle={{ color: '#F44336' }} onTouchTap={() => this.unfollowOrganization(this.props.organization)} />
      </div>
    );
  }
}

ProjectList.propTypes = {
  accessToken: React.PropTypes.string,
  uid: React.PropTypes.string,
  organization: React.PropTypes.shape({
    login: React.PropTypes.string,
  }).isRequired,
};
