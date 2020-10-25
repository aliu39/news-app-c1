import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Article from "./components/Article";

class Obj extends React.Component {
  render() {
    return (
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>{this.props.title + " " + this.props.num}</h1>
        <h1>{JSON.stringify(this.props.myObj)}</h1>
      </header>
    );
  }
}

const Body = props => (
  <p>
    Edit <code>src/App.js</code> and save to reload.
    <a
      className="App-link"
      href="https://reactjs.org"
      target="_blank"
      rel="noopener noreferrer"
    >
      {props.text}
    </a>
  </p>
);

/* GET NEWS FROM API CODE */

// NETLIFY to deploy site
// or github.io

// consideration: keep country as US or go international?
// consider whether cors available after deploying site
const baseUrl =
  "http://cors-anywhere.herokuapp.com/" +
  "http://newsapi.org/v2/top-headlines?" +
  "country=us&category="; //to be modified by getNews()
const key = "&apiKey=f6d3a364faf54888a77e0bab46b8b66c";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [], //json data
      refs: [],
      tab: "Saved articles",
      cached: [],
      cachedRefs: [],
      lastCategory: ""
    };
  }

  getNews(category) {
    if (category !== this.state.lastCategory) {
      let h = new Headers();
      h.append("Accept", "application/json");

      let req = new Request(baseUrl + category + key, {
        method: "GET",
        headers: h,
        mode: "cors"
      });

      fetch(req)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("faulty request response");
          }
        })
        .then(jsonData => {
          var articleData = [];
          for (let i = 0; i < jsonData.articles.length; i++) {
            articleData.push(jsonData.articles[i]);
          }
          console.log("setting lastCategory to " + category);
          this.setState({
            articles: articleData,
            lastCategory: category
          });
        })
        .catch(err => {
          console.log("ERROR: ", err.message);
        });
    }
  }

  updateRefs = () => {
    //go through current tab and saves refs in
    //requires: called only in current tab
  };

  updateCache = () => {
    for (let i = 0; i < this.state.refs.length; i++) {}
    this.setState({});
  };

  toggleTab = () => {
    let tabName =
      this.state.tab === "Saved articles" ? "Back to search" : "Saved articles";
    this.setState({
      articles: this.state.cached,
      tab: tabName,
      cached: this.state.articles
    });
  };

  render() {
    //App className obsolete
    return (
      <div>
        <div align="center">
          <button
            className="search"
            onClick={() => this.getNews("entertainment")}
          >
            Entertainment
          </button>
          <button className="search" onClick={() => this.getNews("sports")}>
            Sports
          </button>
          <button className="search" onClick={() => this.getNews("technology")}>
            Technology
          </button>
        </div>
        <br />
        <div align="right">
          <button className="tab" onClick={this.toggleTab}>
            {this.state.tab}
          </button>
        </div>
        <div className="scrollable">
          <ul>
            {this.state.articles.map(article => (
              <Article info={article} key={article.url} tab={this.state.tab} />
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
