import { h, Component } from 'preact';

import RepoItem from '../components/RepoItem';

import './Repo.css';

export default class Repo extends Component {
  state = {
    items: [],
    loadedOrganization: null,
  }

  shouldComponentUpdate({ selectedOrganization }, { loadedOrganization }) {
    return selectedOrganization !== this.props.selectedOrganization || loadedOrganization !== this.state.loadedOrganization;
  }

  componentDidUpdate() {
    console.log('Repo', this.props.selectedOrganization);
    if (this.props.selectedOrganization !== this.state.loadedOrganization) {
      this.fetch(this.props.selectedOrganization, this.props.accessToken);
    }
  }

  fetch(selectedOrganization, accessToken) {
    const that = this;
    let url = `https://api.github.com/search/repositories?q=user:${selectedOrganization}&sort=updated&order=desc`;
    // let url = `https://api.github.com/users/${selectedOrganization}/repos`;
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
          });
        }
      })
      .catch(err => console.error(err));
  }

  render({ selectedOrganization }, { items }) {
    return (
      <div className="Repo">
        {items.map(item => <RepoItem key={item.name} item={item} />)}
      </div>
    );
  }
}
