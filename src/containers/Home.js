import { h, Component } from 'preact';
import { connect } from 'preact-redux';  // eslint-disable-line
import linkState from 'linkstate';
import Octicon from 'react-octicon';

import firebase from 'firebase';
import store from 'store2';

import { bindActions } from '../util';  // eslint-disable-line
import reduce from '../reducers';  // eslint-disable-line
import * as actions from '../actions';  // eslint-disable-line

import Organization from './Organization';
import RecentOrganization from './RecentOrganization';
import Repo from './Repo';
import RepoReadMe from './RepoReadMe';
import SearchBar from '../components/SearchBar';
import TrendingOrganization from './TrendingOrganization';
import WithLove from '../components/WithLove';

import './Home.css';

@connect(reduce, bindActions(actions))
export default class Home extends Component {
  state = {
    isLogged: false,
    user: null,
    searchValue: '',
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('Logged', user);
        this.setState({
          user,
          isLogged: true,
        });

        const accessToken = store.get('accessToken');
        this.setState({
          accessToken,
        });

        // this.props.AuthStore.setAccessToken(s);

        // const s = store.get(`firebase:authUser:${user.i}:[DEFAULT]`);
        // console.log(s.stsTokenManager.accessToken);
        // if (s.stsTokenManager && s.stsTokenManager.accessToken) {
        //   this.props.AuthStore.setAccessToken(s.stsTokenManager.accessToken);
        // }
      } else {
        console.log('Not logged');
        this.setState({ user: null, isLogged: false });
      }
    });
  }

  toggleSignIn() {
    console.log('Click');
    if (!firebase.auth().currentUser) {
      const provider = new firebase.auth.GithubAuthProvider();

      provider.addScope('user:email,user:follow');

      firebase.auth().signInWithPopup(provider).then((result) => {
        console.log('Auth result', result);
        this.setState({
          user: result.user,
          credential: result.credential,
          accessToken: result.credential.accessToken,
          open: false,
          isLogged: true,
        });
        store('accessToken', result.credential.accessToken);
        // this.props.AuthStore.setAccessToken(result.credential.accessToken);
        // location.reload();  // eslint-disable-line no-undef
      }).catch((error) => {
        console.error(error);
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // const email = error.email;
        // const credential = error.credential;
        // if (errorCode === 'auth/account-exists-with-different-credential') {
        //   alert('You have already signed up with a different auth provider for that email.');
        // } else {
        //   console.error(error);
        // }
      });
    } else {
      firebase.auth().signOut();
    }
  }

  render({ selectedOrganization, selectedRepo, path }, { user, accessToken, isLogged, searchValue }) {
    console.log('path', path);
    return (<div className="Home">
      <div className="Home-header">
        <div className="Home-menu-left">
          <a href="/" className={path === '/' ? 'Home-menu-button-on' : 'Home-menu-button'}>GitFollow</a>
          <a href="/recently" className={path === '/recently' ? 'Home-menu-button-on' : 'Home-menu-button'}>Recently</a>
          <a href="/trending" className={path === '/trending' ? 'Home-menu-button-on' : 'Home-menu-button'}>Trending</a>
        </div>
        <div className="Home-menuCenter">
          <form>
            <input
              type="text"
              value={searchValue}
              onInput={linkState(this, 'searchValue')}
              placeholder="Search"
            />
          </form>
        </div>

        {searchValue && <SearchBar user={user} accessToken={accessToken} text={searchValue} />}

        {!isLogged && <div className="Home-menu-right">
          <Octicon className="Home-sign-out-icon" name="logo-github" onClick={() => this.toggleSignIn()} />
        </div>}
        {isLogged && <div className="Home-menu-right">
          <img className="Home-logo" alt="avatar" src={user.photoURL} />
          <Octicon className="Home-sign-out-icon" name="sign-out" onClick={() => this.toggleSignIn()} />
        </div>}
      </div>

      <div className="Home-content">
        {path === '/' && user && <Organization user={user} accessToken={accessToken} />}
        {path === '/recently' && <RecentOrganization user={user} accessToken={accessToken} />}
        {path === '/trending' && <TrendingOrganization user={user} accessToken={accessToken} />}

        <Repo selectedOrganization={selectedOrganization} accessToken={accessToken} />

        <RepoReadMe selectedRepo={selectedRepo} accessToken={accessToken} />
      </div>

      <WithLove />
    </div>);
  }
}
