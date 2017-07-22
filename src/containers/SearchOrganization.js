import { h, Component } from 'preact';

import OrganizationItem from '../components/OrganizationItem';

import './Organization.css';

let timeoutDebounce = null;

export default class SearchOrganization extends Component {
  state = {
    items: [],
  }

  shouldComponentUpdate({ text }, { searchedText }) {
    return text !== this.props.text || searchedText !== this.state.searchedText;
  }

  componentDidMount() {
    // this.handleUpdateInput(this.props.text, this.props.accessToken);
  }

  componentDidUpdate() {
    if (this.props.text !== this.state.searchedText) {
      clearTimeout(timeoutDebounce)

      timeoutDebounce = setTimeout(() => {
        this.handleUpdateInput(this.props.text, this.props.accessToken);
      }, 1500);
    }
  }

  handleUpdateInput(value, accessToken) {
    const endpoint = 'users';
    const tempType = 'org';

    const that = this;
    let url = `https://api.github.com/search/${endpoint}?q=${value}+type:${tempType}`;

    if (accessToken) {
      url += `&access_token=${accessToken}`;
    }

    fetch(url)  // eslint-disable-line no-undef
      .then(response => response.json())
      .then((json) => {
        console.log('Search api: ', json);
        if (json && json.items && json.items.length > 0) {
          that.setState({
            items: json.items,
            searchedText: value,
            isHidden: false,
          });
        } else if (json && json.items && json.items.length === 0) {
          console.log('Empty result');
          that.setState({
            items: [],
            searchedText: value,
            isHidden: true,
          });
        } else if (json.message.indexOf('API rate limit') !== -1) {
          console.error('RATE LIMIT ERROR');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render({ user, accessToken }, { items }) {
    return (
      <div className="Organization">
        {items.map(item => <OrganizationItem key={item.login} item={item} accessToken={accessToken} user={user} canFollow={true} />)}
      </div>
    );
  }
}
