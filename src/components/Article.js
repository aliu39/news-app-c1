import React from "react";

const img_na =
  "https://www.sahilgraphics.com/wp-content/themes/shahil/assets/" +
  "images/image-not-found.jpg";

// remove time from publishedAt field
function getDate(publishedAt) {
  //sample pubishedAt format: 2020-11-05T03:22:00Z
  let sliceTo = publishedAt.indexOf("T");
  if (sliceTo >= 0) {
    return publishedAt.slice(0, sliceTo);
  } else {
    return publishedAt;
  }
}

/* child of root App component and rendered in scrollable div */
/* contains article data specifics and whether or not the article should be 
   added to the cache when changing tabs */
export default class Article extends React.Component {
  constructor(props) {
    super(props);
    // pre-parse and store props json "info"
    this.state = {
      img_src: props.info.urlToImage,
      source: props.info.source.name,
      title: props.info.title,
      description: props.info.description,
      url: props.info.url,
      content: props.info.content,
      date: getDate(props.info.publishedAt),
      fullData: props.info, //to be accessed by parent App and added to cache
      cached: false, //whether article should be saved on next update to App
      tab: props.tab
    };
  }

  // for debugging
  /*
  componentDidMount() {
    console.log("new article");
  }*/

  /*
  componentWillUnmount() {
    console.log("destroying article");
  }*/

  saveArticle = () => {
    this.setState({
      cached: true
    });
  };

  /* prettier-ignore */
  render() {
    return (
      <div className="article">
        <div className="article-image">
          <img src={this.state.img_src != null ? this.state.img_src : img_na} alt="failed to load"></img>
        </div>
        <div className="article-content">
          <p>
            <b>{this.state.title + " | " + this.state.source + " | " + this.state.date}</b> <br/>
            {this.state.description} <br/>
          </p>
          <p>
            {this.state.content}
          </p>
          <p align="right">
            <a href={this.state.url} target="_blank" rel="noreferrer">
              original article</a> <br />
            {this.state.tab ? null :
              <button onClick={this.saveArticle}>save</button>
            }
          </p>
        </div>
      </div>
    );
  }
}
