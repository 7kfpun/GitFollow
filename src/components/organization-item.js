import React, { Component } from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { GoLink, GoLocation } from 'react-icons/lib/go';
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
      showType: this.props.showingType || 'EVENT',
      expanded: this.props.expanded || false,
    };
  }

  componentDidMount() {
    const that = this;

    // const organizationRef = firebase.database().ref(`organization/${this.props.orgid}`);
    // organizationRef.on('value', (snapshot) => {
    //   if (snapshot.val()) {
    //     console.log('organizationRef', snapshot.val());
    //     that.setState({ organization: snapshot.val() });
    //   } else {
    let url = `https://api.github.com/users/${this.props.name}?`;
    if (this.props.accessToken) {
      url += `&access_token=${this.props.accessToken}`;
    }
    fetch(url)  // eslint-disable-line no-undef
      .then(response => response.json())
      .then((json) => {
        console.log('Organization', json);
        if (json) {
          that.setState({ organization: json });
          that.storeOrganization(json);
        }
      })
      .catch(err => console.error(err));
    //   }
    // });
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
          title={<span>
            {this.state.organization.login ? this.state.organization.login : ''}
            {this.state.organization.name ? ` (${this.state.organization.name})` : ''}
          </span>}
          subtitle={
            <p>
              {this.state.organization.bio ? <span>{this.state.organization.bio}<br /><br /></span> : ''}
              {this.state.organization.location ? <span><GoLocation /> {this.state.organization.location}</span> : ''}
              {this.state.organization.blog ? <span> <GoLink /> {this.state.organization.blog}</span> : ''}
            </p>
          }
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <div>
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
  showingType: React.PropTypes.string,
  expanded: React.PropTypes.bool,
  name: React.PropTypes.string,
  accessToken: React.PropTypes.string,
  uid: React.PropTypes.string,
};
