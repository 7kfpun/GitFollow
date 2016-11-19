import React, { Component } from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';

import firebase from 'firebase';

import EventList from './event-list';
import ProjectList from './project-list';

const styles = {
  container: {
    marginTop: 40,
  },
  button: {
    margin: 12,
  },
};

export default class OrganizationItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFollowed: false,
      organization: {},
      showType: 'EVENT',
      expanded: this.props.expanded || false,
    };
  }

  componentDidMount() {
    const that = this;

    const organizationRef = firebase.database().ref(`organization/${this.props.orgid}`);
    organizationRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        console.log('organizationRef', snapshot.val());
        that.setState({ organization: snapshot.val() });
      } else {
        fetch(`https://api.github.com/users/${this.props.name}`)  // eslint-disable-line no-undef
          .then(response => response.json())
          .then((json) => {
            console.log('Organization', json);
            if (json) {
              that.setState({ organization: json });
              that.storeOrganization(json);
            }
          })
          .catch(err => console.error(err));
      }
    });
  }

  storeOrganization(organization) {
    firebase.database().ref(`organizations/${organization.id}`).set(organization);
  }

  handleExpandChange(expanded) {
    this.setState({ expanded });
  }

  render() {
    return (
      <Card style={styles.container} initiallyExpanded={this.props.expanded} expanded={this.state.expanded} onExpandChange={expanded => this.handleExpandChange(expanded)}>
        <CardHeader
          avatar={<Avatar style={{ backgroundColor: 'white' }} src={this.state.organization.avatar_url} />}
          title={this.props.name}
          subtitle={this.state.organization.html_url}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          {this.state.organization.bio || this.state.organization.blog ? `Blog: ${this.state.organization.blog}` : ''}
          <div style={{ marginTop: 20 }}>
            <RaisedButton
              label="Events"
              style={styles.button}
              backgroundColor={this.state.showType === 'EVENT' ? '#E0E0E0' : null}
              onTouchTap={() => this.setState({ showType: 'EVENT' })}
            />
            <RaisedButton
              label="Repos"
              style={styles.button}
              backgroundColor={this.state.showType === 'PROJECT' ? '#E0E0E0' : null}
              onTouchTap={() => this.setState({ showType: 'PROJECT' })}
            />
          </div>

          {this.state.showType === 'EVENT' && this.state.organization && this.state.organization.login
            && <EventList organization={this.state.organization} accessToken={this.props.accessToken} uid={this.props.uid} />}
          {this.state.showType === 'PROJECT' && this.state.organization && this.state.organization.login
            && <ProjectList organization={this.state.organization} accessToken={this.props.accessToken} uid={this.props.uid} />}
        </CardText>
      </Card>
    );
  }
}

OrganizationItem.propTypes = {
  expanded: React.PropTypes.bool,
  orgid: React.PropTypes.number,
  name: React.PropTypes.string,
  accessToken: React.PropTypes.string,
  uid: React.PropTypes.string,
};
