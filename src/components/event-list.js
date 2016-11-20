import React, { Component } from 'react';
import { darkBlack } from 'material-ui/styles/colors';
import { GoComment, GoCommentDiscussion, GoGitPullRequest, GoIssueOpened, GoRepoForked } from 'react-icons/lib/go';
import { List, ListItem } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
// import Close from 'material-ui/svg-icons/navigation/close';

import firebase from 'firebase';
import moment from 'moment';

const MAXROWS = 4;

export default class EventList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isShowMore: false,
    };
  }

  componentDidMount() {
    const that = this;
    let url = `https://api.github.com/users/${this.props.organization.login}/events?`;
    if (this.props.accessToken) {
      url += `access_token=${this.props.accessToken}`;
    }
    fetch(url)  // eslint-disable-line no-undef
      .then(response => response.json())
      .then((json) => {
        console.log('Events', json);
        if (json) {
          that.setState({
            isLoading: false,
            events: json,
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

    let events = [];
    if (this.state.events) {
      const rows = this.state.isShowMore ? 100 : MAXROWS;
      events = this.state.events.slice(0, rows).map((item, i) => {
        if (item.type === 'WatchEvent') {
          return (<ListItem
            key={i}
            href={`https://github.com/${item.repo.name}`}
            target="_blank"
            primaryText={`${item.actor.display_login} watches ${item.repo.name}`}
            secondaryText={moment(item.created_at).fromNow()}
            leftIcon={<RemoveRedEye />}
          />);
        } else if (item.type === 'ForkEvent') {
          return (<ListItem
            key={i}
            href={`https://github.com/${item.repo.name}`}
            target="_blank"
            primaryText={`${item.actor.display_login} forks ${item.repo.name}`}
            secondaryText={moment(item.created_at).fromNow()}
            leftIcon={<GoRepoForked />}
          />);
        } else if (item.type === 'IssuesEvent') {
          return (<ListItem
            key={i}
            href={item.payload.issue.html_url}
            target="_blank"
            primaryText={`${item.actor.display_login} ${item.payload.action} on issue of ${item.repo.name}`}
            secondaryText={
              <p>
                {moment(item.created_at).fromNow()}
                <span style={{ color: darkBlack }}> - {item.payload.issue.title}</span>
              </p>
            }
            leftIcon={<GoIssueOpened />}
          />);
        } else if (item.type === 'IssueCommentEvent') {
          return (<ListItem
            key={i}
            href={item.payload.comment.html_url}
            target="_blank"
            primaryText={`${item.actor.display_login} commented on issue ${item.payload.issue.number} of ${item.repo.name}`}
            secondaryText={
              <p>
                {moment(item.created_at).fromNow()}
                <span style={{ color: darkBlack }}> - {item.payload.issue.title}</span>
              </p>
            }
            leftIcon={<GoComment />}
          />);
        } else if (item.type === 'PullRequestEvent') {
          return (<ListItem
            key={i}
            href={item.payload.pull_request.html_url}
            target="_blank"
            primaryText={`${item.actor.display_login} ${item.payload.action} a pull request of ${item.repo.name}`}
            secondaryText={
              <p>
                {moment(item.created_at).fromNow()}
                <span style={{ color: darkBlack }}> - {item.payload.pull_request.title}</span>
              </p>
            }
            leftIcon={<GoGitPullRequest />}
          />);
        } else if (item.type === 'PullRequestReviewCommentEvent') {
          return (<ListItem
            key={i}
            href={item.payload.pull_request.html_url}
            target="_blank"
            primaryText={`${item.actor.display_login} a commented on a pull request of ${item.repo.name}`}
            secondaryText={
              <p>
                <span style={{ color: darkBlack }}>to me, Scott, Jennifer</span> --
                {item.payload.pull_request.title}
              </p>
            }
            leftIcon={<GoCommentDiscussion />}
          />);
        }
        // GollumEvent
        return null;
      });
    }

    return (
      <div>
        <List>{events}</List>
        <FlatButton label={!this.state.isShowMore ? 'SHOW MORE' : 'SHOW LESS'} onTouchTap={() => this.setState({ isShowMore: !this.state.isShowMore })} />
        <FlatButton label={'UNFOLLOW'} labelStyle={{ color: '#F44336' }} onTouchTap={() => this.unfollowOrganization(this.props.organization)} />
      </div>
    );
  }
}

EventList.propTypes = {
  organization: React.PropTypes.shape({
    login: React.PropTypes.string,
  }).isRequired,
  accessToken: React.PropTypes.string,
  uid: React.PropTypes.string,
};
