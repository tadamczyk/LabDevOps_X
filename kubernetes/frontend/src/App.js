import React from "react";
import Axios from "axios";
import "./App.css";

export default class App extends React.Component {
  state = {
    results: []
  };

  handleShowResults = async event => {
    event.preventDefault();

    const url = `/api/appId`;

    await Axios
      .get(url)
      .then(response => {
        this.setState({ results: response.data });
      });
  }

  handleHideResults = event => {
    this.setState({ results: [] });
  }

  render() {
    return (
      <div className="App">
        <div>
          <button onClick={this.handleShowResults}>Show application ids</button>
          <button onClick={this.handleHideResults}>Hide application ids</button>
        </div>
        <div>
          <ol>
            {this.state.results.map(item => <li key={item.appid}>{item.appid} - {item.activeto === null ? 'ACTIVE' : 'INACTIVE'}</li>)}
          </ol>
        </div>
      </div>
    )
  }
}