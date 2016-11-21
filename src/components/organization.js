import React, { Component } from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';

import firebase from 'firebase';

import OrganizationItem from './organization-item';

const styles = {
  showSettings: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  menu: {
    marginBottom: 8,
    width: 200,
  },
  toggle: {
    maxWidth: 150,
  },
};

export default class Organization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      organizations: [],
      isEmpty: false,
      expanded: false,
      orderBy: 'NAME',
      showingType: 'EVENT',
    };
  }

  componentDidMount() {
    const uid = this.props.uid;
    const followingRef = firebase.database().ref(`following/${uid}`);
    const that = this;
    followingRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        console.log('followingRef', snapshot.val());
        that.setState({ organizations: Object.values(snapshot.val()), isEmpty: false });
      } else {
        that.setState({ organizations: [], isEmpty: true });
      }
    });
  }

  handleOrderByChange(event, index, value) {
    console.log('Order by', value);
    this.setState({ orderBy: value });
  }

  handleShowingTypeChange(event, index, value) {
    console.log('Showing type', value);
    this.setState({ showingType: value });
  }

  render() {
    if (this.state.isEmpty) {
      return <h5>There is no organization followed yet.</h5>;
    }

    const that = this;
    if (this.state.organizations && this.state.organizations.length > 0) {
      let organizations;
      if (this.state.orderBy === 'NAME') {
        organizations = this.state.organizations.sort((a, b) => a.login.localeCompare(b.login));
      } else {
        organizations = this.state.organizations.sort((a, b) => b.timestamp - a.timestamp);
      }

      return (
        <div>
          <div style={styles.showSettings}>
            <DropDownMenu style={styles.menu} value={this.state.showingType} onChange={(event, index, value) => this.handleShowingTypeChange(event, index, value)}>
              <MenuItem value={'EVENT'} primaryText="Showing events" />
              <MenuItem value={'PROJECT'} primaryText="Showing repos" />
            </DropDownMenu>
            <DropDownMenu style={styles.menu} value={this.state.orderBy} onChange={(event, index, value) => this.handleOrderByChange(event, index, value)}>
              <MenuItem value={'NAME'} primaryText="Name" />
              <MenuItem value={'DATE'} primaryText="Followed date" disabled />
            </DropDownMenu>
            <Toggle
              style={styles.toggle}
              label="Toggle all"
              onToggle={() => this.setState({ expanded: !this.state.expanded })}
            />
          </div>
          {organizations.map((item, i) => <OrganizationItem
            key={i + Math.random()}
            name={item.login}
            orgid={item.id}
            expanded={that.state.expanded}
            accessToken={this.props.accessToken}
            uid={this.props.uid}
            showingType={this.state.showingType}
          />)}
          {/* this.state.organizations.map((item, i) => <OrganizationItem key={i} name={item.login} orgid={item.id} />) */}
        </div>
      );
    }

    return null;
  }
}

Organization.propTypes = {
  accessToken: React.PropTypes.string,
  uid: React.PropTypes.string,
};
