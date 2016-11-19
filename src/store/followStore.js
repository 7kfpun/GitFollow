import { extendObservable } from 'mobx';

class FollowStore {
  constructor() {
    extendObservable(this, {
      accessToken: '',
      refreshToken: '',
    });
  }

  setAccessToken(accessToken) {
    console.log('setAccessToken', accessToken);
    this.accessToken = accessToken;
  }

  setRefreshToken(refreshToken) {
    console.log('setRefreshToken', refreshToken);
    this.refreshToken = refreshToken;
  }
}

export default new FollowStore();
