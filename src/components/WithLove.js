import { h } from 'preact';

import './WithLove.css';

const WithLove = () => (
  <div className="WithLove">
    <span className="WithLove-text">Made with love by kf ©</span>
    <a className="WithLove-email" href="mailto:info@gitfollow.com?Subject=Hello+from+site+footer" target="_top">Email me!</a>
  </div>
);

export default WithLove;
