import { h, Component } from 'preact';
import { connect } from 'preact-redux';  // eslint-disable-line
import TimeAgo from 'react-timeago';

import { bindActions } from '../util';  // eslint-disable-line
import reduce from '../reducers';  // eslint-disable-line
import * as actions from '../actions';  // eslint-disable-line

import './RepoItem.css';

@connect(reduce, bindActions(actions))
export default class RepoItem extends Component {
  state = {
    organization: {},
  }

  render({ item, selectRepo }) {
    return (
      <div
        role="button"
        className="RepoItem"
        onClick={() => { console.log(item); selectRepo(item); }}
      >
        <div className="RepoItem-name">{item.name} <span className="RepoItem-update-at">updated <TimeAgo date={item.updated_at} /></span></div>
        <div className="RepoItem-description">{item.description && item.description.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')}</div>
        <div className="RepoItem-info">⊙ {item.language} | {item.stargazers_count} stars | {item.fork_count} forks</div>
      </div>
    );
  }
}
