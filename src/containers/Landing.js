import { h, Component } from 'preact';
import Octicon from 'react-octicon';

import './Landing.css';

export default class Landing extends Component {
  render() {
    return (<div className="Landing">
      <div className="Landing-background">
        <div className="Landing-text">
          <span className="Landing-text-title">Easiest way to follow Git</span>
          <span className="Landing-text-description">
            <span className="Landing-text-highlight">GitFollow </span>
              is a site to get close with all great organizations.<br />
              Search, follow and keep track of your favourite organizations.
          </span>
          <div><button className="Landing-button btn btn-primary">LOGIN WITH <Octicon className="Landing-button-icon" name="mark-github" onClick={() => this.toggleSignIn()} /></button></div>
        </div>
      </div>
    </div>);
  }
}
