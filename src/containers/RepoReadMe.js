import { h, Component } from 'preact';
import ReactMarkdown from 'react-markdown';

import RateLimit from '../components/RateLimit';

import './RepoReadMe.css';

export default class RepoReadMe extends Component {
  state = {
    markdown: '',
    loadedRepoUrl: null,
    isRateLimit: false,
  }

  shouldComponentUpdate({ selectedRepo }, { loadedRepoUrl, isRateLimit }) {
    return selectedRepo !== this.props.selectedRepo || loadedRepoUrl !== this.state.loadedRepoUrl || isRateLimit !== this.state.isRateLimit;
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
        if (json && json.download_url && json.download_url === 'https://developer.github.com/v3/#rate-limiting') {
          that.setState({
            isRateLimit: true,
          });
        } else if (json && json.download_url) {
          const downloadUrl = accessToken ? `${json.download_url}?access_token=${accessToken}` : json.download_url;
          console.log('Fetch ReadMe content', downloadUrl);
          fetch(downloadUrl)  // eslint-disable-line no-undef
            .then(response => response.text())
            .then((text) => {
              console.log('Response ReadMe content', json);
              that.setState({
                markdown: text,
                loadedRepoUrl: url,
                isRateLimit: false,
              });
            })
            .catch((err) => {
              console.error(err);
              that.setState({
                isRateLimit: false,
              });
            });
        }
      })
      .catch(err => console.error(err));
  }

  render({ selectedRepo }, { markdown, isRateLimit }) {
    if (!selectedRepo) {
      return null;
    }

    return (
      <div className="RepoReadMe">
        <div className="RepoReadMe-title-block">
          <span className="RepoReadMe-title">{selectedRepo.name && selectedRepo.name.toUpperCase()}</span>
          <a className="RepoReadMe-title-url" href={selectedRepo.html_url} target="_blank">View on GitHub</a>
        </div>

        {isRateLimit ? <RateLimit /> : <div className="RepoReadMe-body"><ReactMarkdown source={markdown} /></div>}
      </div>
    );
  }
}
