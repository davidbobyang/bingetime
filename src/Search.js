import React from 'react';
import moment from 'moment';
import popcorn from './popcorn.png';
import default_poster from './default_poster.png';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      results: [],
      final_result: {},
      view: 'home',
      final_string: '',
      trending: [],
      show_background: false
    };

    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleShowBackground = this.handleShowBackground.bind(this);
  }

  handleSubmit(e) {
    // handle a search submission
    e.preventDefault();
    this.setState({
      view: 'results',
    });
    const url = `https://api.themoviedb.org/3/search/tv?page=1&language=en-US&api_key=5114cf314283a1d83f54f9684a701572&query=${this.state.query}`;
    this.fetchSubmitData(url);
  }

  handleQueryChange(e) {
    // handle a change in the search query
    this.setState({ query: e.target.value });
  }

  handleBack(e) {
    // handle a press of the back button
    e.preventDefault();
    if (this.state.results.length === 0) {
      this.setState({
        view: 'home'
      });
    }
    else {
      this.setState({
        view: 'results'
      });
    }
  }

  handleShowBackground(e) {
    // handle a press of the show background button (eye icon)
    e.preventDefault();
    if (this.state.show_background) {
      this.setState({
        show_background: false
      });
    }
    else {
      this.setState({
        show_background: true
      });
    }
  }

  handleClick(e) {
    // handle clicking on a search result
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
          view: 'final',
          final_string: days_string + and_string + hours_string,
          final_result: data,
        });
      })
      .catch(error => console.log(error));
  }

  fetchSubmitData(url) {
    // fetch data for search results
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

  fetchTrendingData() {
    // fetch data for trending tv shows
    let url = 'https://api.themoviedb.org/3/trending/tv/week?api_key=5114cf314283a1d83f54f9684a701572';
    fetch(url, { method: 'GET' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        let temp = data.results;
        temp = temp.slice(0, 5);
        this.setState({
          trending: temp,
        });
        console.log(this.state.trending);
      })
      .catch(error => console.log(error));
  }

  render() {
    let html = [];

    if (!this.state.show_background) {
      if (this.state.view === 'final') {
        // show only the search bar with back button
        html.push(
          <form onSubmit={this.handleSubmit}>
          <div className="box">
            <input className="search-bar two-icons" type="text" value={this.state.query}
              onChange={this.handleQueryChange} autoComplete="off" placeholder="type in a tv show" />
            <button type="submit" className="submit search-button"><i className="fas fa-search"></i></button>
            <button onClick={this.handleBack} className="submit back-button"><i class="fas fa-arrow-left"></i></button>
          </div>
        </form>
        )
      }
      else {
        // show logo and search bar without back button
        html.push(
          <div id="logo-title">
            <a href="http://davidy.me/bingetime/"><h1>bingetime</h1></a>
            <a href="http://davidy.me/bingetime/"><img src={popcorn} alt="popcorn icon"></img></a>
          </div>
        );
        html.push(
          <form onSubmit={this.handleSubmit}>
            <div className="box">
              <input className="search-bar one-icon" type="text" value={this.state.query}
                onChange={this.handleQueryChange} autoComplete="off" placeholder="type in a tv show" />
              <button type="submit" className="submit"><i className="fas fa-search"></i></button>
            </div>
          </form>
        );
      }
    }

    if (this.state.view === 'final') {
      const row_style = {
        backgroundImage: `url(https://image.tmdb.org/t/p/original${this.state.final_result.backdrop_path})`,
        backgroundSize: 'cover',
        backgroundColor: 'rgba(0,0,0,0.5)'
      };
      const twitter_link = `https://twitter.com/intent/tweet?text=${this.state.final_result.name}%20takes%20${this.state.final_string}%20to%20watch.%20Calculated%20at:%20http%3A%2F%2Fdavidy.me/bingetime%2F`;
      const facebook_link = `https://www.facebook.com/sharer/sharer.php?u=http://davidy.me/bingetime`;
      
      if (this.state.show_background) {
        // show only the backdrop
        html.push(
          <div className="container">
            <div className="row final-result-row">
              <div className="col-12">
              </div>
            </div>
            <div className="background-button">
              <button onClick={this.handleShowBackground} className="eye"><i className="fas fa-eye fa-2x"></i></button>
            </div>
          </div>
        );
      }
      else {
        // show final view with the show info and backdrop
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
                    {this.state.final_result.number_of_episodes ? (this.state.final_result.number_of_episodes === 1 ? " episode" : " episodes") : '0 episodes'}
                  </p>
                  <p className="final-result-info">
                    {
                      this.state.final_result.status === "Ended" ?
                        `ended in ${moment(this.state.final_result.last_air_date, "YYYY-MM-DD").format("MMMM YYYY")}` :
                        `${this.state.final_result.status.toLowerCase()}`
                    }
                  </p>
                  <p className="final-result-info">{this.state.final_string ? 'takes ' + this.state.final_string + ' to watch' : ''}</p>
                  <div className="share-icons">
                    <a href={twitter_link}><i class="fab fa-twitter"></i></a>
                    <a href={facebook_link}><i class="fab fa-facebook-f"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="background-button">
              <button onClick={this.handleShowBackground} className="eye"><i className="fas fa-eye fa-2x"></i></button>
            </div>
          </div>
        );
      }
      
      return (<div className="container-fluid" style={row_style}>{html}</div>);
    }
    
    if (this.state.view === 'results') {
      // show search results
      html.push(
        <div className="results container">
          {this.state.results.map(result => (
            <div className="row result-row" key={result.id}>
              <div className="col-xl-3 col-md-4 col-sm-12 result-col">
                <button onClick={this.handleClick} className="result" value={result.id}>
                  <img src={result.poster_path ? `https://image.tmdb.org/t/p/w154${result.poster_path}` : default_poster} alt={result.name}></img>
                </button>
              </div>
              <div className="d-none d-md-block col-xl-9 col-md-8">
                <button onClick={this.handleClick} className="result" value={result.id}>
                  {result.name}
                </button>
                <p className="result-aired">first aired: {result.first_air_date ? moment(result.first_air_date, "YYYY-MM-DD").format("MMMM YYYY") : 'TBD'}</p>
                <p className="result-overview">{result.overview}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (this.state.view === 'home') {
      if (this.state.trending.length === 0) {
        // fetch trending data if it hasn't been fetched yet
        this.fetchTrendingData();
      }
      
      // show trending tv shows
      html.push(
        <div className="trending">
          <div className="trending-title">
            <i class="fas fa-fire fa-2x"></i><h2>trending</h2><i class="fas fa-fire fa-2x"></i>
          </div>
          <div className="trending-shows">
            {this.state.trending.map(trending_show => (
              <button onClick={this.handleClick} className="trending-show" value={trending_show.id}>
                {trending_show.name}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (<div className="container-fluid">{html}</div>);
  }
}

export default Search;