import { extendObservable } from 'mobx';

class AuthStore {
  constructor() {
    extendObservable(this, {
      accessToken: '',
      refreshToken: '',

      isLoginNeeded: false,

      displayName: '',
      email: '',
      photoURL: './icon.png',
      uid: '',
    });
  }

  setUserInfo(displayName, email, photoURL, uid) {
    this.displayName = displayName;
    this.email = email;
    this.photoURL = photoURL;
    this.uid = uid;
  }

  setAccessToken(accessToken) {
    console.log('setAccessToken', accessToken);
    this.accessToken = accessToken;
  }

  setRefreshToken(refreshToken) {
    console.log('setRefreshToken', refreshToken);
    this.refreshToken = refreshToken;
  }

  openLoginDialog() {
    console.log('openLoginDialog');
    this.isLoginNeeded = true;
  }

  closeLoginDialog() {
    console.log('openLoginDialog');
    this.isLoginNeeded = false;
  }
}

export default new AuthStore();
