import { h, Component } from 'preact';

import firebase from 'firebase';
import OrganizationItem from '../components/OrganizationItem';

import './Organization.css';

export default class RecentOrganization extends Component {
  state = {
    items: [],
  }

  componentDidMount() {
    const that = this;
    const followingRef = firebase.database().ref('organizations');
    followingRef.orderByChild('timestamp').limitToLast(16).once('value', (snapshot) => {
      if (snapshot.val()) {
        console.log('followingRef', snapshot.val());
        const items = [];
        snapshot.forEach((child) => {
          items.unshift(child.val());
        });
        that.setState({ items, isEmpty: false });
      } else {
        that.setState({ items: [], isEmpty: true });
      }
    });
  }

  render({ user, accessToken }, { items, isEmpty }) {
    if (isEmpty) {
      return (<div className="Organization">
        <div className="Organization-empty">
          <span>There is no organization followed yet.</span>
          <span>Search add follow your favourite organizations.</span>
        </div>
      </div>);
    }
    return (
      <div className="Organization">
        {items.map(item => <OrganizationItem key={item.login} item={item} accessToken={accessToken} user={user} canFollow={true} />)}
      </div>
    );
  }
}
