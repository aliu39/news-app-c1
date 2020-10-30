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
const PAGESIZE = 20; //default articles per request defined by NewsAPI
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
      currPage: 1,
      currKeyword: ""
    };
  }

  composeUrl = () => {
    let url =
      PROXY +
      "https://newsapi.org/v2/top-headlines?" +
      "apiKey=" +
      APIKEY +
      (this.state.US ? "&country=us" : "") +
      "&pageSize=" +
      PAGESIZE +
      "&page=" +
      this.state.currPage +
      "&category=" +
      this.state.category;
    if (this.state.keywords.length > 0) {
      url += "&q=";
      for (let i = 0; i < this.state.keywords.length; i++) {
        url += this.state.keywords[i];
      }
    }
    return url;
  };

  //must be used as setState callback, as setState is asynchronous
  getNews = () => {
    if (this.state.category !== "") {
      let h = new Headers();
      h.append("Accept", "application/json");
      let reqUrl = this.composeUrl();
      console.log(reqUrl);
      let req = new Request(reqUrl, {
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
    }
  };

  updateRefs = () => {
    //go through current tab and saves refs in
    //requires: called only in current tab
  };

  updateCache = () => {
    console.log("cache update");
    let newCache = [];
    let seen = new Set();
    let numEntries = 0;
    for (let i = 0; numEntries < PAGESIZE && i < this.state.refs.length; i++) {
      let article = this.state.refs[i].current;
      if (article.state.cached) {
        newCache.push(article.state.fullData);
        seen.add(article.state.url);
        numEntries++;
      }
    }
    for (let i = 0; numEntries < PAGESIZE && i < this.state.cache.length; i++) {
      let data = this.state.cache[i];
      if (seen.has(data.url)) {
        console.log("deleted old save entry");
      } else {
        newCache.push(data);
        numEntries++;
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

  categoryBtn = cat => {
    this.setState(
      {
        category: cat,
        currPage: 1,
        keywords: []
      },
      this.getNews
    );
  };

  pageDecr = () => {
    if (this.state.currPage > 1) {
      this.setState(
        {
          currPage: this.state.currPage - 1
        },
        this.getNews
      );
    }
  };

  pageIncr = () => {
    if (this.state.articles.length > 0) {
      this.setState(
        {
          currPage: this.state.currPage + 1
        },
        this.getNews
      );
    }
  };

  //Form helpers
  handleChange = event => {
    this.setState({ currKeyword: event.target.value });
  };

  handleSubmit = event => {
    if (this.state.currKeyword !== "") {
      this.setState(
        {
          keywords: [this.state.currKeyword].concat(this.state.keywords),
          currKeyword: ""
        },
        this.getNews
      );
    }
    event.preventDefault();
  };

  clearKeywords = () => {
    this.setState({ keywords: [] }, this.getNews);
  };

  render() {
    //App className obsolete
    return (
      <div>
        <div align="center">
          <button
            className="styled categoryBtn"
            onClick={() => this.categoryBtn("entertainment")}
          >
            Entertainment
          </button>
          <button
            className="styled categoryBtn"
            onClick={() => this.categoryBtn("sports")}
          >
            Sports
          </button>
          <button
            className="styled categoryBtn"
            onClick={() => this.categoryBtn("technology")}
          >
            Technology
          </button>
        </div>

        <div className="controlbar">
          <div className="prevnext">
            {this.state.tab ? null : (
              <button onClick={this.pageDecr} className="styled">
                prev
              </button>
            )}
            {this.state.tab ? null : (
              <button onClick={this.pageIncr} className="styled">
                next
              </button>
            )}
          </div>
          <div className="searchbar">
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                style={{ marginLeft: 10, marginRight: 10 }}
                value={this.state.currKeyword}
                onChange={this.handleChange}
              ></input>
              <input type="submit" value="Add keyword"></input>
              <button onClick={this.clearKeywords}>Clear Filters</button>
            </form>{" "}
            {this.state.keywords.toString()} <br />
          </div>
          <div className="tab">
            {this.state.tab ? (
              <button onClick={this.clearCache} className="styled">
                Clear
              </button>
            ) : null}
            <button onClick={this.toggleTab} className="styled">
              {this.state.tab ? "Search results" : "Saved articles"}
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
