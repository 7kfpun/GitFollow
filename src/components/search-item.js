import React, { Component } from 'react';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import firebase from 'firebase';

const styles = {
  container: {
    marginTop: 40,
  },
};

export default class SearchItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFollowed: false,
    };
  }

  // componentDidMount() {
  //   this.storeOrganization(this.props.organization);
  // }

  storeOrganization(organization) {
    firebase.database().ref(`organizations/${organization.id}`).set(organization);
  }

  followOrganization(organization) {
    console.log(organization.id, organization);
    this.setState({ isFollowed: true });

    const uid = 'T1iwi2AKCqSFgbzqt08ZsACOMAO2';
    firebase.database().ref(`following/${uid}`).child(organization.id).set({
      id: organization.id,
      login: organization.login,
      html_url: organization.html_url,
      site_admin: organization.site_admin,
      type: organization.type,
      timestamp: new Date().getTime(),
    });
  }

  unfollowOrganization(organization) {
    console.log(organization.id, organization);
    this.setState({ isFollowed: false });
  }

  render() {
    return (
      <Card style={styles.container}>
        <CardHeader
          avatar={this.props.organization.avatar_url}
          title={this.props.organization.login}
          subtitle={this.props.organization.html_url}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardActions>
          <FlatButton label="GitHub" href={this.props.organization.html_url} target="_blank" />
          <FlatButton label="Follow" onTouchTap={() => this.followOrganization(this.props.organization)} />
        </CardActions>
        <CardText expandable={true}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
          Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
          Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
        </CardText>
      </Card>
    );
  }
}

SearchItem.propTypes = {
  organization: React.PropTypes.shape({
    avatar_url: React.PropTypes.string,
    login: React.PropTypes.string,
    html_url: React.PropTypes.string,
  }).isRequired,
};
