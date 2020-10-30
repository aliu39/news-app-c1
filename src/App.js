import React from "react";
// import "./App.css";
import Article from "./components/Article";

/* GET NEWS FROM API CODE */

// NETLIFY to deploy site
// or github.io

// consideration: keep country as US or go international?
// consider whether cors available after deploying site

const APIKEY = "78b9d599c4f94f8fa3afb1a5458928d6";
const PROXY = "https://cors-anywhere.herokuapp.com/";
const PAGESIZE = 20; //standard articles per page defined by NewsAPI
const key = "&apiKey=f6d3a364faf54888a77e0bab46b8b66c";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [], //json data
      refs: [],
      tab: false, //short for "is currently on saved tab"
      cache: [],
      cachedRefs: [],
      category: "",
      keywords: [],
      US: true,
      currPage: 1
    };
    this.currPage = 1;
  }

  composeBaseUrl = () => {
    return (
      PROXY +
      "https://newsapi.org/v2/top-headlines?" +
      "apiKey=" +
      APIKEY +
      (this.state.US ? "&country=us" : "") +
      "&pageSize=" +
      PAGESIZE +
      "&page=" +
      this.state.currPage +
      "&category="
    ); //to be added to
  };

  //takes category as direct input, since set state asynchronous
  getNews = category => {
    // if (category !== this.state.lastCategory) {
    let h = new Headers();
    h.append("Accept", "application/json");
    let baseUrl = this.composeBaseUrl();
    console.log(baseUrl);
    let req = new Request(baseUrl + category, {
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
        } else {
          this.updateCache();
        }

        console.log(jsonData.totalResults);

        var articleData = [];
        var newRefs = [];
        for (let i = 0; i < jsonData.articles.length; i++) {
          articleData.push(jsonData.articles[i]);
          newRefs.push(React.createRef());
        }
        // console.log("setting lastCategory to " + category);
        this.setState({
          articles: articleData,
          refs: newRefs
          // lastCategory: category
        });
      })
      .catch(err => {
        console.log("ERROR: ", err.message);
      });

    // this.setState({ currPage: this.state.currPage + 1 });
  };

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

  clearCache = () => {
    if (this.state.tab) {
      this.setState({
        articles: []
      });
    }
  };

  toggleTab = () => {
    let newCache = this.state.tab ? this.state.cache : this.updateCache();
    this.setState({
      articles: newCache,
      tab: !this.state.tab,
      cache: this.state.articles
    });
  };

  pageDecr = () => {
    if (this.state.currPage > 1) {
    }
  };

  pageIncr = () => {
    if (this.state.currPage < 10) {
    }
  };

  render() {
    //App className obsolete
    return (
      <div>
        <div align="center">
          <button
            className="categoryBtn"
            onClick={() => this.getNews("entertainment")}
          >
            Entertainment
          </button>
          <button
            className="categoryBtn"
            onClick={() => this.getNews("sports")}
          >
            Sports
          </button>
          <button
            className="categoryBtn"
            onClick={() => this.getNews("technology")}
          >
            Technology
          </button>
        </div>

        <div className="controlbar">
          <div className="prevnext">
            <button onClick={this.pageDecr}>prev</button>
            <button onClick={this.pageIncr}>next</button>
          </div>
          <div className="searchbar">SEARCH</div>
          <div className="tab">
            {this.state.tab ? (
              <button className="tab" onClick={this.clearCache}>
                Clear
              </button>
            ) : null}
            <button className="tab" onClick={this.toggleTab}>
              {this.state.tab ? "Search" : "Saved"}
            </button>
          </div>
        </div>

        <div className="scrollable">
          <ul>
            {this.state.articles.map((article, i) => (
              <Article
                info={article}
                key={this.state.tab + article.url}
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
