(this["webpackJsonpnews-app"]=this["webpackJsonpnews-app"]||[]).push([[0],{13:function(t,e,s){},14:function(t,e,s){"use strict";s.r(e);var a=s(0),r=s(1),c=s.n(r),n=s(7),o=s.n(n),i=(s(13),s(2)),l=s(3),u=s(5),h=s(4),d=function(t){Object(u.a)(s,t);var e=Object(h.a)(s);function s(t){var a;return Object(i.a)(this,s),(a=e.call(this,t)).saveArticle=function(){a.setState({cached:!0})},a.state={img_src:t.info.urlToImage,source:t.info.source.name,title:t.info.title,description:t.info.description,url:t.info.url,content:t.info.content,fullData:t.info,strData:JSON.stringify(t.info),cached:!1,tab:t.tab},a}return Object(l.a)(s,[{key:"componentDidMount",value:function(){console.log("new article")}},{key:"componentWillUnmount",value:function(){console.log("destroying article")}},{key:"render",value:function(){return Object(a.jsxs)("div",{className:"article",children:[Object(a.jsx)("img",{src:null!=this.state.img_src?this.state.img_src:"https://www.sahilgraphics.com/wp-content/themes/shahil/assets/images/image-not-found.jpg"}),Object(a.jsxs)("p",{children:[Object(a.jsx)("b",{children:this.state.title+" "+this.state.source})," ",Object(a.jsx)("br",{}),this.state.description," ",Object(a.jsx)("br",{})]}),Object(a.jsx)("p",{children:this.state.content}),Object(a.jsxs)("p",{align:"right",children:[Object(a.jsx)("a",{href:this.state.url,target:"_blank",rel:"noreferrer",children:"original article"})," ",Object(a.jsx)("br",{}),this.state.tab?null:Object(a.jsx)("button",{onClick:this.saveArticle,children:"save"})]})]})}}]),s}(c.a.Component),b=function(t){Object(u.a)(s,t);var e=Object(h.a)(s);function s(t){var a;return Object(i.a)(this,s),(a=e.call(this,t)).composeUrl=function(){var t="https://cors-anywhere.herokuapp.com/https://newsapi.org/v2/top-headlines?apiKey=78b9d599c4f94f8fa3afb1a5458928d6"+(a.state.US?"&country=us":"")+"&pageSize=20&page="+a.state.currPage+"&category="+a.state.category;if(a.state.keywords.length>0){t+="&q=";for(var e=0;e<a.state.keywords.length;e++)t+=a.state.keywords[e]}return t},a.getNews=function(){if(""!==a.state.category){var t=new Headers;t.append("Accept","application/json");var e=a.composeUrl();console.log(e);var s=new Request(e,{method:"GET",headers:t,mode:"cors"});fetch(s).then((function(t){if(t.ok)return t.json();throw new Error("faulty response status "+t.status)})).then((function(t){a.state.tab?a.toggleTab():a.updateCache(),console.log(t.totalResults);for(var e=t.totalResults,s=[],r=[],n=0;n<t.articles.length;n++)s.push(t.articles[n]),r.push(c.a.createRef());a.setState({articles:s,refs:r,totalResults:e,requests:a.state.requests+1})})).catch((function(t){console.log("ERROR: ",t.message)}))}},a.updateRefs=function(){},a.updateCache=function(){console.log("cache update");for(var t=[],e=new Set,s=0,r=0;s<20&&r<a.state.refs.length;r++){var c=a.state.refs[r].current;c.state.cached&&(t.push(c.state.fullData),e.add(c.state.url),s++)}for(var n=0;s<20&&n<a.state.cache.length;n++){var o=a.state.cache[n];e.has(o.url)?console.log("deleted old save entry"):(t.push(o),s++)}return t},a.clearCache=function(){a.state.tab&&a.setState({articles:[]})},a.toggleTab=function(){var t=a.state.tab?a.state.cache:a.updateCache();a.setState({articles:t,tab:!a.state.tab,cache:a.state.articles})},a.categoryBtn=function(t){a.setState({category:t,currPage:1,keywords:[]},a.getNews)},a.pageDecr=function(){a.state.currPage>1&&a.setState({currPage:a.state.currPage-1},a.getNews)},a.pageIncr=function(){a.state.currPage<Math.ceil(a.state.totalResults/20)&&a.setState({currPage:a.state.currPage+1},a.getNews)},a.handleChange=function(t){a.setState({currKeyword:t.target.value})},a.handleSubmit=function(t){""!==a.state.currKeyword&&a.setState({keywords:[a.state.currKeyword].concat(a.state.keywords),currKeyword:"",currPage:1},a.getNews),t.preventDefault()},a.clearKeywords=function(){a.setState({keywords:[]},a.getNews)},a.state={articles:[],refs:[],tab:!1,cache:[],category:"",keywords:[],US:!0,currPage:1,currKeyword:"",totalResults:0,requests:0},a}return Object(l.a)(s,[{key:"render",value:function(){var t=this;return Object(a.jsxs)("div",{children:[Object(a.jsxs)("div",{align:"center",children:[Object(a.jsx)("button",{className:"styled categoryBtn",onClick:function(){return t.categoryBtn("entertainment")},children:"Entertainment"}),Object(a.jsx)("button",{className:"styled categoryBtn",onClick:function(){return t.categoryBtn("sports")},children:"Sports"}),Object(a.jsx)("button",{className:"styled categoryBtn",onClick:function(){return t.categoryBtn("technology")},children:"Technology"})]}),Object(a.jsxs)("div",{className:"controlbar",children:[Object(a.jsxs)("div",{className:"prevnext",children:[this.state.tab||1===this.state.currPage?null:Object(a.jsx)("button",{onClick:this.pageDecr,className:"styled",children:"prev"}),this.state.tab||this.state.currPage>=Math.ceil(this.state.totalResults/20)?null:Object(a.jsx)("button",{onClick:this.pageIncr,className:"styled",children:"next"})]}),Object(a.jsxs)("div",{className:"searchbar",children:[Object(a.jsxs)("form",{onSubmit:this.handleSubmit,children:[Object(a.jsx)("input",{type:"text",style:{marginLeft:10,marginRight:10},value:this.state.currKeyword,onChange:this.handleChange}),Object(a.jsx)("input",{type:"submit",value:"Add keyword"}),Object(a.jsx)("button",{onClick:this.clearKeywords,children:"Clear Filters"})]})," ",this.state.keywords.toString()," ",Object(a.jsx)("br",{})]}),Object(a.jsxs)("div",{className:"tab",children:[this.state.tab?Object(a.jsx)("button",{onClick:this.clearCache,className:"styled",children:"Clear"}):null,Object(a.jsx)("button",{onClick:this.toggleTab,className:"styled",children:this.state.tab?"Search results":"Saved articles"})]})]}),Object(a.jsxs)("div",{className:"scrollable",children:[0===this.state.articles.length?Object(a.jsx)("h2",{children:Object(a.jsx)("b",{children:0===this.state.requests?"Click a category to begin":"No results found"})}):null,Object(a.jsx)("ul",{children:this.state.articles.map((function(e,s){return Object(a.jsx)(d,{info:e,tab:t.state.tab,ref:t.state.refs[s]},t.state.tab+e.url)}))})]})]})}}]),s}(c.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(Object(a.jsx)(c.a.StrictMode,{children:Object(a.jsx)(b,{})}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))}},[[14,1,2]]]);
//# sourceMappingURL=main.05b29c19.chunk.js.map