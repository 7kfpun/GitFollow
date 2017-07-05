import { h, Component } from 'preact';
import { connect } from 'preact-redux';  // eslint-disable-line
import ReactPlaceholder from 'react-placeholder';
import { TextBlock, RoundShape } from 'react-placeholder/lib/placeholders';

import firebase from 'firebase';

import { bindActions } from '../util';  // eslint-disable-line
import reduce from '../reducers';  // eslint-disable-line
import * as actions from '../actions';  // eslint-disable-line

import './OrganizationItem.css';
import '../../node_modules/react-placeholder/lib/reactPlaceholder.css';

const awesomePlaceholder = (
  <div className="OrganizationItem OrganizationItem-react-placeholder">
    <RoundShape color="#e0e0e0" style={{ width: 40, height: 40, marginRight: 15 }} />
    <TextBlock rows={3} color="#e0e0e0" style={{ height: 30, paddingRight: 100 }} />
  </div>
);

@connect(reduce, bindActions(actions))
export default class OrganizationItem extends Component {
  state = {
    organization: {},
  }

  shouldComponentUpdate({ selectedOrganization }, { organization, isFollowed }) {
    return selectedOrganization !== this.props.selectedOrganization || (organization && this.state.organization && organization.id !== this.state.organization.id) || isFollowed !== this.state.isFollowed;
  }

  componentDidMount() {
    const that = this;

    let url = `https://api.github.com/users/${this.props.item.login}`;
    if (this.props.accessToken) {
      url += `?access_token=${this.props.accessToken}`;
    }

    fetch(url)  // eslint-disable-line no-undef
      .then(response => response.json())
      .then((json) => {
        console.log('Organization', json);
        if (json) {
          that.setState({ organization: json });
        }
      })
      .catch(err => console.error(err));

    const uid = this.props.user && this.props.user.uid;
    if (uid && this.props.item && this.props.item.id) {
      const followingRef = firebase.database().ref(`following/${uid}/${this.props.item.id}`);
      followingRef.on('value', (snapshot) => {
        console.log('followingRef isFollowed', snapshot.val());
        if (snapshot.val() && snapshot.val().id === that.props.item.id) {
          that.setState({ isFollowed: true });
        } else {
          that.setState({ isFollowed: false });
        }
      });
    } else {
      that.setState({ isFollowed: false });
    }
  }

  followOrganization(organization, user) {
    this.setState({ isFollowed: true });

    const uid = user.uid;
    if (uid) {
      // this.props.AuthStore.openLoginDialog();
    }

    const data = {
      ...organization,
      timestamp: new Date().getTime(),
    };
    firebase.database().ref(`following/${uid}`).child(organization.id).set(data);
    Object.keys(organization).forEach((key) => {
      console.log(key, organization[key]);
      firebase.database().ref(`organizations/${organization.id}`).child(key).set(organization[key]);
    });
  }

  unfollowOrganization = (item, user) => {
    console.log('Unfollow organization', item);
    firebase.database().ref(`following/${user.uid}`).child(item.id).set(null);
  }

  render({ selectedOrganization, item, selectOrganization, selectRepo, user, canFollow }, { isFollowed, organization }) {
    return (
      <ReactPlaceholder
        showLoadingAnimation
        ready={organization.id}
        type="media"
        rows={3}
        customPlaceholder={awesomePlaceholder}
      >
        <div
          className={selectedOrganization === item.login ? 'OrganizationItemSelected' : 'OrganizationItem'}
          onClick={() => { selectOrganization(item.login); selectRepo(); }}
        >
          <div className="OrganizationItem-left">
            <img alt="" className="OrganizationItem-avatar" src={item.avatar_url} />
            <div className="OrganizationItem-details">
              <span className="OrganizationItem-name">{organization.name || item.login}</span>
              <div className="OrganizationItem-location">{organization.location || item.type}</div>
              {organization.public_repos && <div className="OrganizationItem-location">{organization.public_repos} repos</div>}
            </div>
          </div>
          {user && isFollowed && <a href="#">
            <button
              className="OrganizationItem-unfollow-button btn"
              onClick={(e) => { e.stopPropagation(); this.unfollowOrganization(item, user); }}
            >Unfollow</button>
          </a>}
          {user && !isFollowed && <a href="#">
            <button
              className="OrganizationItem-follow-button btn"
              onClick={(e) => { e.stopPropagation(); this.followOrganization(item, user); }}
            >Follow</button>
          </a>}
        </div>
      </ReactPlaceholder>
    );
  }
}
