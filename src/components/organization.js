import React, { Component } from 'react';
import Toggle from 'material-ui/Toggle';

import firebase from 'firebase';

import OrganizationItem from './organization-item';

const styles = {
  toggle: {
    marginBottom: 16,
  },
};

export default class Organization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      organizations: [],
      expanded: false,
    };
  }

  componentDidMount() {
    const uid = this.props.uid;
    const followingRef = firebase.database().ref(`following/${uid}`);
    const that = this;
    followingRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        console.log('followingRef', snapshot.val());
        that.setState({ organizations: Object.values(snapshot.val()) });
      } else {
        that.setState({ organizations: [] });
      }
    });
  }

  render() {
    const that = this;
    if (this.state.organizations && this.state.organizations.length > 0) {
      return (
        <div>
          <Toggle
            label="Toggle all"
            style={styles.toggle}
            onToggle={() => this.setState({ expanded: !this.state.expanded })}
          />
          {this.state.organizations.map((item, i) => <OrganizationItem
            key={i + Math.random()}
            name={item.login}
            orgid={item.id}
            expanded={that.state.expanded}
            accessToken={this.props.accessToken}
            uid={this.props.uid}
          />)}
          {/* this.state.organizations.map((item, i) => <OrganizationItem key={i} name={item.login} orgid={item.id} />) */}
        </div>
      );
    }
    return <h5>There is no organization followed yet.</h5>;
  }
}

Organization.propTypes = {
  accessToken: React.PropTypes.string,
  uid: React.PropTypes.string,
};
