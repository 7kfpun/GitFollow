import { h, Component } from 'preact';
import ReactDOM from 'react-dom';

import SearchItem from './SearchItem';

import './SearchBar.css';

export default class SearchBar extends Component {
  state = {
    items: [],
    isHidden: false,
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside.bind(this), true);
  }

  shouldComponentUpdate({ text }, { searchedText, isHidden }) {
    return text !== this.props.text || searchedText !== this.state.searchedText || isHidden !== this.state.isHidden;
  }

  componentDidUpdate() {
    if (this.props.text !== this.state.searchedText) {
      this.handleUpdateInput(this.props.text, this.props.accessToken);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside.bind(this), true);
  }

  handleClickOutside(event) {
    const domNode = ReactDOM.findDOMNode(this);

    if ((!domNode || !domNode.contains(event.target))) {
      console.log('Outside');
      this.setState({
        isHidden: true,
      });
    }
  }

  handleUpdateInput(value, accessToken) {
    if (value.length < 2) {
      return false;
    }

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

  render({ user, text }, { items, isHidden }) {
    if (isHidden) {
      return null;
    }

    return (
      <div
        role="button"
        className="SearchBar"
      >
        {items.map(item => <SearchItem user={user} item={item} />)}
      </div>
    );
  }
}
