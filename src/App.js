import React from "react";
import logo from "./logo.svg";
// import "./App.css";
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
const proxy = "https://cors-anywhere.herokuapp.com/";
//"https://newsapi.org/v2/top-headlines?country=us&category="
const baseUrl = "https://newsapi.org/v2/everything?language=en&q="; //to be modified by getNews()
const key = "&apiKey=f6d3a364faf54888a77e0bab46b8b66c";
const key2 = "&apiKey=78b9d599c4f94f8fa3afb1a5458928d6";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [], //json data
      refs: [],
      tab: 0,
      cache: [],
      cachedRefs: [],
      lastCategory: ""
    };
  }

  getNews(category) {
    // if (category !== this.state.lastCategory) {
    let h = new Headers();
    h.append("Accept", "application/json");
    console.log(baseUrl);
    let req = new Request(proxy + baseUrl + category + key2, {
      method: "GET",
      headers: h,
      mode: "cors"
    });

    fetch(req)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("faulty response status " + response.status);
        }
      })
      .then(jsonData => {
        //first update cache
        if (this.state.tab) {
          this.toggleTab();
        }
        if (category !== this.state.lastCategory) {
          this.updateCache();
        }

        var articleData = [];
        var newRefs = [];
        for (let i = 0; i < jsonData.articles.length; i++) {
          articleData.push(jsonData.articles[i]);
          newRefs.push(React.createRef());
        }
        console.log("setting lastCategory to " + category);
        this.setState({
          articles: articleData,
          refs: newRefs,
          lastCategory: category
        });
      })
      .catch(err => {
        console.log("ERROR: ", err.message);
      });
  }

  updateRefs = () => {
    //go through current tab and saves refs in
    //requires: called only in current tab
  };

  updateCache = () => {
    console.log("cache update");
    let newCache = [];
    let seen = new Set();
    for (let i = 0; i < this.state.refs.length; i++) {
      let article = this.state.refs[i].current;
      if (article.state.cached) {
        newCache.push(article.state.fullData);
        seen.add(article.state.url);
      }
    }
    for (let i = 0; i < this.state.cache.length; i++) {
      let data = this.state.cache[i];
      if (seen.has(data.url)) {
        console.log("deleted old save entry");
      } else {
        newCache.push(data);
      }
    }
    return newCache;
  };

  toggleTab = () => {
    let newCache = this.state.tab ? this.state.cache : this.updateCache();
    this.setState({
      articles: newCache,
      tab: !this.state.tab,
      cache: this.state.articles
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
            {this.state.tab ? "Return to search" : "Saved articles"}
          </button>
        </div>
        <div className="scrollable">
          <ul>
            {this.state.articles.map((article, i) => (
              <Article
                info={article}
                key={article.url}
                tab={this.state.tab}
                ref={this.state.refs[i]}
              />
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
