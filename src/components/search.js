import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

import SearchItem from './search-item';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchType: 'organization',
      searchTerm: '',
      results: [],
    };
  }

  componentDidMount() {
    this.clickSearch();
  }

  handleSearchTypeChange(event, index, value) {
    this.setState({ searchType: value });
  }

  handleSearchTermChange(event) {
    this.setState({ searchTerm: event.target.value });
    this.clickSearch();
  }

  clickSearch() {
    if (!this.state.searchTerm) {
      this.setState({ results: [] });
      return false;
    }

    console.log('Search', this.state.searchType, this.state.searchTerm);
    let endpoint;
    let tempType;
    if (this.state.searchType === 'user') {
      endpoint = 'users';
      tempType = 'user';
    } else if (this.state.searchType === 'organization') {
      endpoint = 'users';
      tempType = 'org';
    } else {
      tempType = 'repositories';
    }

    const that = this;
    let url = `https://api.github.com/search/${endpoint}?q=${this.state.searchTerm}+type:${tempType}`;
    if (this.props.accessToken) {
      url += `&access_token=${this.props.accessToken}`;
    }
    fetch(url)  // eslint-disable-line no-undef
      .then(response => response.json())
      .then((json) => {
        console.log(json);
        if (json && json.items) {
          that.setState({
            results: json.items,
          });
        }
      })
      .catch((err) => {
        if (err.message.indexOf('API rate limit') !== -1) {
          console.error('RATE LIMIT ERROR');
        }
        console.error(err);
      });
  }

  render() {
    return (
      <div>
        <h2>Git Follow</h2>

        <TextField
          hintText="search..."
          floatingLabelText="Search organization name"
          value={this.state.searchTerm}
          onChange={event => this.handleSearchTermChange(event)}
          fullWidth
        />

        <div>
          {this.state.results.map((item, i) => <SearchItem key={i} organization={item} />)}
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  accessToken: React.PropTypes.string,
};

export default Search;
