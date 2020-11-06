import React from "react";
import Article from "./components/Article";

const APIKEY = "78b9d599c4f94f8fa3afb1a5458928d6";
const PROXY = "https://cors-anywhere.herokuapp.com/";
const PAGESIZE = 20; //default articles per request defined by NewsAPI
//const key2 = "&apiKey=f6d3a364faf54888a77e0bab46b8b66c"; //free developer key

/* Root component. Contains most of site's functionality */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [], //data as json objects
      refs: [], //refs to children, used to check if cache should update
      tab: false, //"is currently on saved tab"
      cache: [], //json data of currently hidden tab
      category: "",
      keyword: "",
      US: true,
      currPage: 1,
      formValue: "", //used for form element / controlled text
      totalResults: 0, //article count from last request, across ALL pages
      requests: 0 //# successful requests made so far
    };
    this.scrollRef = React.createRef(); //ref to scrollable div element
  }

  // compose request url from state
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
    if (this.state.keyword !== "") {
      url += "&q=" + this.state.keyword;
    }
    return url;
  };

  // uses curr. state search params to make new request and store new data
  /* if App state is changed immediately before this is called, getNews must be 
     used as a setState callback, as setState is asynchronous */
  getNews = () => {
    //avoid null category request
    if (this.state.category !== "") {
      let h = new Headers();
      h.append("Accept", "application/json");
      let reqUrl = this.composeUrl();
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
          // first update cache
          if (this.state.tab) {
            this.toggleTab();
          }
          let newCache = this.updateCache();

          // create new refs and store along with new data
          let totalCount = jsonData.totalResults;
          let articleData = [];
          let newRefs = [];
          //note: articles.length <= PAGESIZE
          for (let i = 0; i < jsonData.articles.length; i++) {
            articleData.push(jsonData.articles[i]);
            newRefs.push(React.createRef());
          }
          this.setState(
            {
              articles: articleData,
              refs: newRefs,
              totalResults: totalCount,
              requests: this.state.requests + 1,
              cache: newCache
            },
            () => (this.scrollRef.current.scrollTop = 0) //reset scrollable div
          );
        })
        .catch(err => {
          console.log("ERROR: ", err.message);
        });
    }
  };

  // iterate through current article refs, cache ones with state.cached = true
  // lazily called before changing tab or making a new request
  updateCache = () => {
    if (this.state.tab) {
      return this.state.cache;
    } else {
      let newCache = [];
      let seen = new Set();
      let numEntries = 0;
      // new entries
      for (
        let i = 0;
        numEntries < PAGESIZE && i < this.state.refs.length;
        i++
      ) {
        let article = this.state.refs[i].current;
        if (article.state.cached) {
          newCache.push(article.state.fullData);
          seen.add(article.state.url);
          numEntries++;
        }
      }
      // old entries
      for (
        let i = 0;
        numEntries < PAGESIZE && i < this.state.cache.length;
        i++
      ) {
        let data = this.state.cache[i];
        if (seen.has(data.url)) {
          // avoid duplicates
          // console.log("deleted old save entry");
        } else {
          newCache.push(data);
          numEntries++;
        }
      }
      return newCache;
    }
  };

  clearCache = () => {
    if (this.state.tab) {
      this.setState({
        articles: []
      });
    }
  };

  // change between saved article and search results tab
  toggleTab = () => {
    let newCache = this.updateCache();
    this.setState({
      articles: newCache,
      tab: !this.state.tab,
      cache: this.state.articles
    });
  };

  // search button functions
  categoryBtn = cat => {
    this.setState(
      {
        category: cat,
        currPage: 1,
        keyword: ""
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
    if (this.state.currPage < Math.ceil(this.state.totalResults / PAGESIZE)) {
      this.setState(
        {
          currPage: this.state.currPage + 1
        },
        this.getNews
      );
    }
  };

  toggleCountry = () => {
    this.setState(
      {
        US: !this.state.US
      },
      this.getNews
    );
  };

  // Form fxs (integrates HTML form w/React state, using controlled text)
  handleChange = event => {
    this.setState({ formValue: event.target.value });
  };

  handleSubmit = event => {
    if (this.state.formValue !== "") {
      this.setState(
        {
          keyword: this.state.formValue,
          formValue: "",
          currPage: 1
        },
        this.getNews
      );
    }
    event.preventDefault();
  };

  clearKeyword = () => {
    this.setState({ keyword: "" }, this.getNews);
  };

  render() {
    return (
      <div>
        {/* Main category buttons */}
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
          {/* previous/next page buttons */}
          <div className="prevnext">
            {this.state.tab ? null : this.state.currPage === 1 ? null : (
              <button onClick={this.pageDecr} className="styled">
                prev
              </button>
            )}
            {this.state.tab ? null : this.state.currPage >=
              Math.ceil(this.state.totalResults / PAGESIZE) ? null : (
              <button onClick={this.pageIncr} className="styled">
                next
              </button>
            )}
          </div>

          {/* keyword form + country filter */}
          <div className="searchbar">
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                style={{ marginLeft: 10, marginRight: 10 }}
                value={this.state.formValue}
                onChange={this.handleChange}
              ></input>
              <input type="submit" value="Add keyword"></input>
              <button onClick={this.clearKeyword}>Clear Filters</button>
              <button onClick={this.toggleCountry}>
                {this.state.US ? "Intl." : "U.S."}
              </button>
            </form>
            {this.state.keyword} <br />
          </div>

          {/* toggle tab + clear cache buttons */}
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

        {/* articles (output div) */}
        <div className="scrollable" ref={this.scrollRef}>
          {this.state.articles.length === 0 ? (
            <h2>
              <b>
                {this.state.requests === 0
                  ? "Click a category to begin"
                  : this.state.tab
                  ? "No saved articles"
                  : "No results found"}
              </b>
            </h2>
          ) : null}
          <ul>
            {this.state.articles.map((article, i) => (
              /* store reference to */
              <Article
                info={article}
                key={this.state.tab + i + article.url}
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
