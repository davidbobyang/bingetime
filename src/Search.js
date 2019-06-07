import React from 'react';
import moment from 'moment';
import popcorn from './popcorn.png';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      results: [],
      final_result: {},
      final_view: false,
      final_string: '',
    };

    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      final_view: false,
    });
    const url = `https://api.themoviedb.org/3/search/tv?page=1&language=en-US&api_key=5114cf314283a1d83f54f9684a701572&query=${this.state.query}`;
    this.fetchSubmitData(url);
  }

  handleQueryChange(e) {
    this.setState({ query: e.target.value });
  }

  handleClick(e) {
    e.preventDefault();
    let id = e.currentTarget.value;
    let url = `https://api.themoviedb.org/3/tv/${id}?language=en-US&api_key=5114cf314283a1d83f54f9684a701572`;
    fetch(url, { method: 'GET' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        let sum = data.number_of_episodes * data.episode_run_time[0];
        let time = moment.duration(sum, "minutes");
        // let total_hours = console.log(time.asHours());
        let days = time.days();
        let hours = time.hours();
        let days_string = (days ? (days === 1 ? "1 day" : days + " days") : "");
        let hours_string = (hours ? (hours === 1 ? "1 hour" : hours + " hours") : "");
        let and_string = days_string && hours_string ? " and " : "";

        this.setState({
          final_view: true,
          final_string: days_string + and_string + hours_string,
          final_result: data,
        });
      })
      .catch(error => console.log(error));
  }

  fetchSubmitData(url) {
    fetch(url, { method: 'GET' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        let temp = data.results;
        temp = temp.slice(0, 5);
        this.setState({
          results: temp,
        });
        console.log(data);
        console.log(this.state.results);
      })
      .catch(error => console.log(error));
  }

  render() {
    let html = [];
    if (!this.state.final_view) {
      html.push(
        <div id="logo-title">
          <h1>bingetime</h1>
          <img src={popcorn} alt="popcorn icon"></img>
        </div>
      );
    }
    html.push(
      <form onSubmit={this.handleSubmit}>
        <div className="box">
          <input id="search-bar" type="text" value={this.state.query}
            onChange={this.handleQueryChange} autoComplete="off" placeholder="type in a tv show" />
          <button type="submit" className="submit"><i className="fas fa-search"></i></button>
        </div>
      </form>
    );

    if (this.state.final_view) {
      const row_style = {
        backgroundImage: `url(https://image.tmdb.org/t/p/original${this.state.final_result.backdrop_path})`,
        backgroundSize: 'cover',
        backgroundColor: 'rgba(0,0,0,0.5)'
      };
      html.push(
        <div className="container">
          <div className="row final-result-row">
            <div className="col-12">
              <div className="final-wrapper">
                <div className="final-result">
                  {this.state.final_result.name}
                </div>
                <p className="final-result-info">
                  {this.state.final_result.number_of_seasons}
                  {this.state.final_result.number_of_seasons === 1 ? " season, " : " seasons, "}
                  {this.state.final_result.number_of_episodes}
                  {this.state.final_result.number_of_episodes === 1 ? " episode" : " episodes"}
                </p>
                <p className="final-result-info">
                  {
                    this.state.final_result.status === "Ended" ?
                      `ended in ${moment(this.state.final_result.last_air_date, "YYYY-MM-DD").format("MMMM YYYY")}` :
                      `${this.state.final_result.status.toLowerCase()}`
                  }
                </p>
                <p className="final-result-info">takes {this.state.final_string} to watch</p>
              </div>
            </div>
          </div>
          <div id="output"></div>
        </div>
      );
      return (<div className="container-fluid" style={row_style}>{html}</div>);
    }
    html.push(
      <div className="results container">
        {this.state.results.map(result => (
          <div className="row result-row" key={result.id}>
            <div className="col-xl-3 col-md-4 col-sm-12 result-col">
              <button onClick={this.handleClick} className="result" value={result.id}>
                <img src={`https://image.tmdb.org/t/p/w154${result.poster_path}`} alt={result.name}></img>
              </button>
            </div>
            <div className="d-none d-md-block col-xl-9 col-md-8">
              <button onClick={this.handleClick} className="result" value={result.id}>
                {result.name}
              </button>
              <p className="result-aired">first aired: {moment(result.first_air_date, "YYYY-MM-DD").format("MMMM YYYY")}</p>
              <p className="result-overview">{result.overview}</p>
            </div>
          </div>
        ))}
      </div>
    );
    return (<div className="container-fluid">{html}</div>);
  }
}

export default Search;