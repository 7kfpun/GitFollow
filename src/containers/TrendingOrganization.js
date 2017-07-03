import { h, Component } from 'preact';

import firebase from 'firebase';
import OrganizationItem from '../components/OrganizationItem';

import './Organization.css';

export default class TrendingOrganization extends Component {
  state = {
    items: [{
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
  }

  render({ user, accessToken }, { items }) {
    return (
      <div className="Organization">
        {items.map(item => <OrganizationItem key={item.login} item={item} accessToken={accessToken} user={user} canFollow={true} />)}
      </div>
    );
  }
}
