import { h, Component } from 'preact';
import ReactMarkdown from 'react-markdown';

import './RepoReadMe.css';

export default class RepoReadMe extends Component {
  state = {
    markdown: '',
    loadedRepoUrl: null,
  }

  shouldComponentUpdate({ selectedRepo }, { loadedRepoUrl }) {
    return selectedRepo !== this.props.selectedRepo || loadedRepoUrl !== this.state.loadedRepoUrl;
  }

  componentDidUpdate() {
    if (this.props.selectedRepo && this.props.selectedRepo.url !== this.state.loadedRepoUrl) {
      this.fetchReadMe(this.props.selectedRepo.url, this.props.accessToken);
    }
  }

  fetchReadMe(url, accessToken) {
    const that = this;

    const readmeUrl = accessToken ? `${url}/readme?access_token=${accessToken}` : `${url}/readme`;
    console.log('Fetch ReadMe API', readmeUrl);
    fetch(readmeUrl)  // eslint-disable-line no-undef
      .then(response => response.json())
      .then((json) => {
        console.log('Response ReadMe API', json);
        if (json && json.download_url) {
          const downloadUrl = accessToken ? `${json.download_url}?access_token=${accessToken}` : json.download_url;
          console.log('Fetch ReadMe content', downloadUrl);
          fetch(downloadUrl)  // eslint-disable-line no-undef
            .then(response => response.text())
            .then((text) => {
              console.log('Response ReadMe content', json);
              that.setState({
                markdown: text,
                loadedRepoUrl: url,
              });
            })
            .catch(err => console.error(err));
        }
      })
      .catch(err => console.error(err));
  }

  render({ selectedRepo }, { markdown }) {
    if (!selectedRepo) {
      return null;
    }

    return (
      <div
        className="RepoReadMe"
      >
        <div className="RepoReadMe-title-block">
          <span className="RepoReadMe-title">{selectedRepo.name}</span>
          <a href={selectedRepo.html_url} target="_blank">View on GitHub</a>
        </div>
        <ReactMarkdown className="RepoReadMe-body" source={markdown} />
      </div>
    );
  }
}
