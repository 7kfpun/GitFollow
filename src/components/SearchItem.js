import { h, Component } from 'preact';

import firebase from 'firebase';

import './SearchItem.css';

export default class SearchItem extends Component {
  state = {
    isFollowed: false,
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

    firebase.database().ref('organizations').child(organization.id).set(data);
  }

  render({ user, item }, { isFollowed }) {
    return (
      <div
        role="button"
        className="SearchItem"
        onClick={() => {
          console.log('Click follow', item, user);
          this.followOrganization(item, user);
          this.setState({ isFollowed: true });
        }}
      >
        <div className="SearchItem-left">
          <div className="SearchItem-name">{item.login}</div>
          <div className="SearchItem-type">{item.type}</div>
        </div>
        {isFollowed && <span className="SearchItem-followed-button">Followed</span>}
      </div>
    );
  }
}
