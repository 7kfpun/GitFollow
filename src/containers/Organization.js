import { h, Component } from 'preact';

import firebase from 'firebase';
import OrganizationItem from '../components/OrganizationItem';

import './Organization.css';

export default class Organization extends Component {
  state = {
    items: [],
    isEmpty: null,
  }

  shouldComponentUpdate({ user }, { isEmpty }) {
    return user !== this.props.user || isEmpty !== this.state.isEmpty;
  }

  componentDidMount() {
    const uid = this.props.user && this.props.user.uid;
    console.log(this.props.user);
    if (uid) {
      const followingRef = firebase.database().ref(`following/${uid}`);
      const that = this;
      followingRef.orderByChild('updated_at').on('value', (snapshot) => {
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
  }

  render({ user, accessToken }, { items, isEmpty }) {
    if (isEmpty) {
      return (<div className="Organization">
        <div className="Organization-empty">
          <span>There is no organization followed yet.</span>
          <span>Search and follow your favourite organizations.</span>
        </div>
      </div>);
    }

    return (
      <div className="Organization">
        {items.map(item => <OrganizationItem key={item.login} item={item} accessToken={accessToken} user={user} />)}
      </div>
    );
  }
}
