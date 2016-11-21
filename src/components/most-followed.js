import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import Subheader from 'material-ui/Subheader';

import firebase from 'firebase';

const styles = {
  container: {
    margin: 'auto',
    width: '80%',
    display: 'flex',
  },
  avatar: {
    backgroundColor: 'white',
  },
  block: {
    marginTop: 20,
    marginBottom: 50,
    flex: 1,
  },
};

const data = {
  today: [{
    login: 'google',
    name: 'Google',
    avatar_url: 'https://avatars0.githubusercontent.com/u/1342004?v=3&s=200',
  }, {
    login: 'facebook',
    name: 'Facebook',
    avatar_url: 'https://avatars0.githubusercontent.com/u/69631?v=3&s=200',
  }, {
    login: 'twbs',
    name: 'Bootstrap',
    bio: 'Source code and more for the most popular front-end framework in the world.',
    avatar_url: 'https://avatars3.githubusercontent.com/u/2918581?v=3&s=200',
  }, {
    login: 'twitter',
    name: 'Twitter, Inc.',
    bio: 'Working with and contributing to the open source community',
    avatar_url: 'https://avatars1.githubusercontent.com/u/50278?v=3&s=200',
  }, {
    login: 'github',
    name: 'GitHub',
    bio: 'How people build software.',
    avatar_url: 'https://avatars3.githubusercontent.com/u/9919?v=3&s=200',
  }, {
    login: 'mozilla',
    name: 'Mozilla',
    bio: 'This technology could fall into the right hands.',
    avatar_url: 'https://avatars0.githubusercontent.com/u/131524?v=3&s=200',
  }, {
    login: 'jquery',
    name: 'jQuery',
    avatar_url: 'https://avatars2.githubusercontent.com/u/70142?v=3&s=200',
  }, {
    login: 'h5bp',
    name: 'H5BP',
    avatar_url: 'https://avatars1.githubusercontent.com/u/1136800?v=3&s=200',
  }],
  recommended: [{
    login: 'google',
    name: 'Google',
    avatar_url: 'https://avatars0.githubusercontent.com/u/1342004?v=3&s=200',
  }, {
    login: 'facebook',
    name: 'Facebook',
    avatar_url: 'https://avatars0.githubusercontent.com/u/69631?v=3&s=200',
  }, {
    login: 'twbs',
    name: 'Bootstrap',
    bio: 'Source code and more for the most popular front-end framework in the world.',
    avatar_url: 'https://avatars3.githubusercontent.com/u/2918581?v=3&s=200',
  }, {
    login: 'twitter',
    name: 'Twitter, Inc.',
    bio: 'Working with and contributing to the open source community',
    avatar_url: 'https://avatars1.githubusercontent.com/u/50278?v=3&s=200',
  }, {
    login: 'github',
    name: 'GitHub',
    bio: 'How people build software.',
    avatar_url: 'https://avatars3.githubusercontent.com/u/9919?v=3&s=200',
  }, {
    login: 'mozilla',
    name: 'Mozilla',
    bio: 'This technology could fall into the right hands.',
    avatar_url: 'https://avatars0.githubusercontent.com/u/131524?v=3&s=200',
  }, {
    login: 'jquery',
    name: 'jQuery',
    avatar_url: 'https://avatars2.githubusercontent.com/u/70142?v=3&s=200',
  }, {
    login: 'h5bp',
    name: 'H5BP',
    avatar_url: 'https://avatars1.githubusercontent.com/u/1136800?v=3&s=200',
  }],
};

export default class Organization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      today: [],
      recommended: [],
    };
  }

  componentDidMount() {
    const uid = 'Pgp3jBOoyDUxCdHCMPq4PBl81f52';
    const followingRef = firebase.database().ref(`following/${uid}`);
    const that = this;
    followingRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        console.log('followingRef', snapshot.val());
        that.setState({ today: Object.values(snapshot.val()) });
      } else {
        that.setState({ today: data.today });
      }
      that.setState({
        recommended: data.recommended,
        isLoading: false,
      });
    });
  }

  render() {
    const today = this.state.today.slice(0, 8).sort((a, b) => b.timestamp - a.timestamp);
    const that = this;
    return (
      <div style={styles.container}>
        <List style={styles.block}>
          <Subheader>Trending: today</Subheader>
          {this.state.isLoading && <CircularProgress style={{ marginLeft: 15 }} size={20} />}
          {today.map((item, i) => <ListItem
            key={i}
            primaryText={`${item.login}`}
            leftAvatar={<Avatar style={styles.avatar} src={item.avatar_url} />}
            rightIcon={<RaisedButton label="Follow" onTouchTap={() => that.props.AuthStore.openLoginDialog()} />}
          />)}
        </List>
        <List style={styles.block}>
          <Subheader>Recommended</Subheader>
          {this.state.isLoading && <CircularProgress style={{ marginLeft: 15 }} size={20} />}
          {this.state.recommended.map((item, i) => <ListItem
            key={i}
            primaryText={`${item.login} (${item.name})`}
            leftAvatar={<Avatar style={styles.avatar} src={item.avatar_url} />}
            rightIcon={<RaisedButton label="Follow" onTouchTap={() => that.props.AuthStore.openLoginDialog()} />}
          />)}
        </List>
      </div>
    );
  }
}

Organization.propTypes = {
  accessToken: React.PropTypes.string,
  uid: React.PropTypes.string,
};
