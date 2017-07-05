import { h, Component } from 'preact';

import RateLimit from '../components/RateLimit';
import RepoItem from '../components/RepoItem';

import './Repo.css';

export default class Repo extends Component {
  state = {
    items: [],
    loadedOrganization: null,
    isRateLimit: false,
  }

  shouldComponentUpdate({ selectedOrganization }, { loadedOrganization, isRateLimit }) {
    return selectedOrganization !== this.props.selectedOrganization
      || loadedOrganization !== this.state.loadedOrganization
      || isRateLimit !== this.state.isRateLimit;
  }

  componentDidUpdate() {
    console.log('Repo', this.props.selectedOrganization);
    if (this.props.selectedOrganization !== this.state.loadedOrganization) {
      this.fetch(this.props.selectedOrganization, this.props.accessToken);
    }
  }

  fetch(selectedOrganization, accessToken) {
    if (!selectedOrganization) {
      this.setState({
        items: [],
        loadedOrganization: '',
      });
      return;
    }

    const that = this;
    let url = `https://api.github.com/search/repositories?q=user:${selectedOrganization}&sort=updated&order=desc`;
    // let url = `https://api.github.com/users/${selectedOrganization}/repos?`;
    if (accessToken) {
      url += `&access_token=${accessToken}`;
    }
    fetch(url)  // eslint-disable-line no-undef
      .then(response => response.json())
      .then((json) => {
        console.log('Repos', json);
        if (json && json.items) {
          that.setState({
            items: json.items,
            loadedOrganization: selectedOrganization,
            isRateLimit: false,
          });
        } else if (json && json.documentation_url === 'https://developer.github.com/v3/#rate-limiting') {
          that.setState({
            items: [],
            loadedOrganization: selectedOrganization,
            isRateLimit: true,
          });
        } else if (json && json.message === 'Validation Failed') {
          console.log('call here');
          that.setState({
            items: [],
            loadedOrganization: selectedOrganization,
            isRateLimit: false,
          });
        }
      })
      .catch(err => console.error(err));
  }

  render({ selectedOrganization }, { items, loadedOrganization, isRateLimit }) {
    return (
      <div className="Repo">
        {items && items.map(item => <RepoItem key={item.name} item={item} />)}
        {items.length === 0 && isRateLimit && <div className="Repo-empty-box"><RateLimit /></div>}
        {items.length === 0 && !isRateLimit && loadedOrganization && <div className="flash Repo-empty-box">No repos in this orgranization.</div>}
      </div>
    );
  }
}
