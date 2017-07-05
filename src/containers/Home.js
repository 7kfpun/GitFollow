import { h, Component } from 'preact';
import { connect } from 'preact-redux';  // eslint-disable-line
import linkState from 'linkstate';
import Octicon from 'react-octicon';

import firebase from 'firebase';
import store from 'store2';

import { bindActions } from '../util';  // eslint-disable-line
import reduce from '../reducers';  // eslint-disable-line
import * as actions from '../actions';  // eslint-disable-line

import Landing from './Landing';
import Organization from './Organization';
import RecentOrganization from './RecentOrganization';
import Repo from './Repo';
import RepoReadMe from './RepoReadMe';
import SearchOrganization from './SearchOrganization';
import TrendingOrganization from './TrendingOrganization';

import SearchBar from '../components/SearchBar';
import WithLove from '../components/WithLove';

import './Home.css';

const ENTER_KEY = 13;

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

  handleKeyPress = (event) => {
    if (event.keyCode === ENTER_KEY) {
      console.log('enter press here! ');
      this.setState({ isPressSearch: Math.random() });
      event.preventDefault();
    }
  }

  render({ selectedOrganization, selectedRepo, selectOrganization, selectRepo, path }, { user, accessToken, isLogged, searchValue, isPressSearch }) {
    console.log('path', path);
    return (<div className="Home">
      <div className="Home-header">
        <div className="Home-menu-left">
          <a href="/" className={path === '/' && !searchValue ? 'Home-menu-button-on' : 'Home-menu-button'} onClick={() => { this.setState({ searchValue: '' }); selectOrganization(); selectRepo(); }}>GitFollow</a>
          <a href="/recently" className={path === '/recently' && !searchValue ? 'Home-menu-button-on' : 'Home-menu-button'} onClick={() => { this.setState({ searchValue: '' }); selectOrganization(); selectRepo(); }}>Recently</a>
          <a href="/trending" className={path === '/trending' && !searchValue ? 'Home-menu-button-on' : 'Home-menu-button'} onClick={() => { this.setState({ searchValue: '' }); selectOrganization(); selectRepo(); }}>Trending</a>
        </div>
        <div className="Home-menuCenter">
          <form>
            <input
              type="text"
              value={searchValue}
              onInput={linkState(this, 'searchValue')}
              onKeyPress={this.handleKeyPress}
              placeholder="Search"
            />
          </form>
        </div>

        {searchValue && <SearchBar user={user} accessToken={accessToken} text={searchValue} />}

        {!isLogged && <div className="Home-menu-right">
          <a href="#" onClick={() => this.toggleSignIn()}>
            <span>Login with</span>
            <Octicon className="Home-logo-github-icon" name="logo-github" />
          </a>
        </div>}
        {isLogged && <div className="Home-menu-right">
          <img className="Home-logo" alt="avatar" src={user.photoURL} />
          <Octicon className="Home-sign-out-icon" name="sign-out" onClick={() => this.toggleSignIn()} />
        </div>}
      </div>

      <div className="Home-content">
        {path === '/' && user && !searchValue && <Organization user={user} accessToken={accessToken} />}
        {path === '/' && !user && !searchValue && <Landing />}

        {searchValue && <SearchOrganization user={user} accessToken={accessToken} text={searchValue} isPressSearch={isPressSearch} />}

        {path === '/recently' && !searchValue && <RecentOrganization user={user} accessToken={accessToken} />}
        {path === '/trending' && !searchValue && <TrendingOrganization user={user} accessToken={accessToken} />}

        {(path === '/recently' || path === '/trending' || user || searchValue) && <Repo selectedOrganization={selectedOrganization} accessToken={accessToken} />}
        {(path === '/recently' || path === '/trending' || user || searchValue) && <RepoReadMe selectedRepo={selectedRepo} accessToken={accessToken} />}
      </div>

      <WithLove />
    </div>);
  }
}
