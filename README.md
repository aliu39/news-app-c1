​​Website URL: https://aliu39.github.io/news-app-c1/

# Project Description / How to use:

​This is a single-page news article search site, created using fetch request to NewsAPI ("top headlines" category) and a Javascript/React framework. To begin browsing, choose one category from Sports, Entertainment, or Technology. Use the previous/next buttons to navigate the pages of search results, consisting of headline news articles from the last 24 months. Further filters can be applied: namely, keyword matching and country of origin (US or International). Finally, you may ​save​ up to 20 articles of interest at a time, by clicking the "save" button on a given article. Via the "saved articles" tab button on the upper-right​, these cached articles are available at any time, and one may freely toggle between them and the current search results.

Enjoy!

# My Approach / Reflection:

​​After learning the basics of fetching web/JSON data, Javascript's fetch API,​ and bypassing CORS via a proxy, I found that using the NewsAPI fields to filter articles was quite straightforward. From there, my primary goal was to create a presentation interface as intuitive and user-friendly as possible.

To do so, I chose to learn the React framework, due to its simple, yet effective ability to create dynamic single-page sites through automatic re-rendering and state changes. With React, I was able to keep each article's data and HTML front-end separate, by encapsulating it as its own component. This made it very easy to render a variable number of articles through the parent "App" component, within a scrollable div, updated with each fetch request without reloading the page. It also birthed the idea of having a "saved articles" cache, making further use of React state and refs.

This was the first time I've actually built and deployed a web app that used Javascript, not to mention React. As a result my greatest challenge was self-learning both of these tools on the fly, doing my best to avoid bugs and potential bad habits.

If I were to improve on this project, I would look into minimizing the number of requests made to the API. Right now, a new request is made every time one changes the search parameters, even if it's just changing pages or applying a keyword filter to an existing search result. This is quite wasteful, as NewsAPI allows for fetching up to 100 articles at a time, which I found to be more than enough for a top headline category request. Perhaps I could implement a larger hidden cache using React state, like I did with "saved articles". Or, simply Javascript, to avoid React's hidden overhead. By paging through and filtering this cache directly and restricting requests to fetching ​new​ data only, run-time would greatly improve.

# Original Challenge Prompt (from MindSumo):

**Deliverables**
We would like you to build a web application using News API that will help users find their desired news. We want to see your creativity in action! Just make sure your solutions include these requirements:

1. Submit a deployed web application and include both your website URL and the supporting Github repository.
2. The app must use News API as the exclusive data source.
   Your app should limit searches to the following three categories: entertainment, sports, and technology. Any news not belonging to one of the approved categories should be filtered accordingly.
3. Your app should display search results in a user-friendly format that provides information about the news article (headline, source, date, etc). Be sure to include a link to the article that opens in a new tab/window.

**Considerations:**
-If a resource is not accessible, the return code should be addressed.
-Images fetched from URLs are various sizes, so care should be given with re-sizing images displayed.

Feel free to go above and beyond these requirements as you build your solution! Here are some other features to consider:
-Display images and descriptions returned by the API in a clever or visually pleasing way
-Extra Credit will be given for detecting which articles are behind paywalls and displaying an indication of a paywall.

Submissions will be graded on the following criteria:
-Meets Deliverables
-Creativity
-Clarity

(This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and deployed with https://facebook.github.io/create-react-app/docs/deployment.)