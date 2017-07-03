import { h, Component } from 'preact';
import { connect } from 'preact-redux';  // eslint-disable-line
import Octicon from 'react-octicon';

import firebase from 'firebase';

import { bindActions } from '../util';  // eslint-disable-line
import reduce from '../reducers';  // eslint-disable-line
import * as actions from '../actions';  // eslint-disable-line

import './OrganizationItem.css';

@connect(reduce, bindActions(actions))
export default class OrganizationItem extends Component {
  state = {
    organization: {},
  }

  static storeOrganization(organization, user) {
    Object.keys(organization).forEach((key) => {
      console.log(key, organization[key]);
      firebase.database().ref(`organizations/${organization.id}`).child(key).set(organization[key]);
    });

    // firebase.database().ref(`following/${uid}`).child(organization.id).set(data);
    // firebase.database().ref('organizations').child(organization.id).set(data);
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
          OrganizationItem.storeOrganization(json, this.props.user);
        }
      })
      .catch(err => console.error(err));
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
    OrganizationItem.storeOrganization(data, user);
  }

  unfollowOrganization = (item, user) => {
    console.log('Unfollow organization', item);
    firebase.database().ref(`following/${user.uid}`).child(item.id).set(null);
  }

  render({ selectedOrganization, item, selectOrganization, user, canFollow }) {
    return (
      <div
        className={selectedOrganization === item.login ? 'OrganizationItemSelected' : 'OrganizationItem'}
        onClick={() => { console.log(item.login); selectOrganization(item.login); }}
      >
        <div className="OrganizationItem-left">
          <img alt="A" className="OrganizationItem-avatar" src={item.avatar_url} />
          <div className="OrganizationItem-details">
            <span className="OrganizationItem-name">{this.state.organization.name || item.login}</span>
            <div className="OrganizationItem-location">{this.state.organization.location || this.state.organization.login}</div>
            <div className="OrganizationItem-location">{this.state.organization.public_repos} repos</div>
          </div>
        </div>
        {user && !canFollow && <a href="#">
          <Octicon
            className="OrganizationItem-delete-icon"
            name="trashcan"
            onClick={(e) => { e.stopPropagation(); this.unfollowOrganization(item, user); }}
          />
        </a>}
        {user && canFollow && <a href="#">
          <span
            className="OrganizationItem-delete-icon"
            onClick={(e) => { e.stopPropagation(); this.followOrganization(item, user); }}
          >follow</span>
        </a>}
      </div>
    );
  }
}
