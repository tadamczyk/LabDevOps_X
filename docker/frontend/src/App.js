import React from "react";
import Axios from "axios";
import "./App.css";

export default class App extends React.Component {
  state = {
    date: "",
    nextLeapYearLabel: "",
    results: []
  };

  handleFormChange = event => {
    this.setState({ date: event.target.value });
  };

  handleFormSubmit = async event => {
    event.preventDefault();

    const url = `/api/leapYear/next/${this.state.date}`;

    await Axios
      .get(url)
      .then(response => {
        this.setState({ nextLeapYearLabel: response.data });
      });
  }

  handleShowResults = async event => {
    event.preventDefault();

    const url = `/api/leapYear/next/all/results`;

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
          <form onSubmit={this.handleFormSubmit}>
            <label>
              Enter some date (YYYY-MM-DD): <input type="text" name="date" onChange={this.handleFormChange} />
            </label>
            <button type="submit">Check!</button>
          </form>
          <label>{this.state.nextLeapYearLabel}</label>
        </div>
        <div>
          <button onClick={this.handleShowResults}>Show results</button>
          <button onClick={this.handleHideResults}>Hide results</button>
        </div>
        <div>
          <ol>
            {this.state.results.map(item => <li key={item.date}>{item.date} -> {item.next_leap_year}</li>)}
          </ol>
        </div>
      </div>
    )
  }
}