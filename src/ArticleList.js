import React from 'react';
import axios from 'axios';
import qs from 'query-string';
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './ArticleList.scss';

import ArticleCard from './ArticleCard';

class ArticleList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchString: '',
      currentResultSearchString: '',
      articleList: new Array(20).fill({}),
      days: 1,
      isError: false
    };
  }

  async componentDidMount() {
    const query = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
    if ({}.hasOwnProperty.call(query, 'd')) {
      await this.fetchPopularDay(parseInt(query.d))
    } else if ({}.hasOwnProperty.call(query, 'q')) {
      this.setState({
        searchString: query.q
      }, async () => { await this.search() })
    }
    await this.fetchPopularArticles()
  }

  async fetchPopularDay(days) {
    if (days === this.state.days) return;
    if (days !== 1) {
      this.props.history.replace({
        pathname: '/',
        search: `?d=${days}`
      })
    } else {
      this.props.history.replace({
        pathname: '/'
      })
    }
    this.setState({
      days: days,
      articleList: new Array(20).fill({}),
    }, async () => { await this.fetchPopularArticles() })
  }

  async fetchPopularArticles() {
    if (this.state.days !== 1 && this.state.days !== 7 && this.state.days !== 30) return
    try {
      const result = await axios(`https://api.nytimes.com/svc/mostpopular/v2/viewed/${this.state.days}.json`, {
        params: {
          'api-key': 'sUQ8dTWn3YkU8lXbS1LBT0R1plZwY9Hw'
        }
      })
      if (result.data.status !== 'OK') throw new Error('NYTimes endpoint return status as not ok')
      this.setState({
        articleList: result.data.results
      })
    } catch (error) {
      this.setState({ isError: true })
      console.error(error)
    }
  }

  async onSubmit(event) {
    event.preventDefault()
    document.activeElement.blur()
    await this.search()
  }

  async search() {
    this.props.history.replace({
      pathname: '/',
      search: `?q=${this.state.searchString}`
    })
    this.setState({
      searchedArticleList: new Array(20).fill({}),
      isViewingSearchResult: true,
      currentResultSearchString: this.state.searchString
    })
    try {
      const result = await axios('https://api.nytimes.com/svc/search/v2/articlesearch.json', {
        params: {
          'api-key': 'sUQ8dTWn3YkU8lXbS1LBT0R1plZwY9Hw',
          q: this.state.searchString
        }
      })
      if (result.data.status !== 'OK') throw new Error('NYTimes endpoint return status as not ok')
      this.setState({
        searchedArticleList: result.data.response.docs,
      })
    } catch (error) {
      this.setState({ isError: true })
      console.error(error)
    }
  }

  async clearSearchResult() {
    this.props.history.replace({
      pathname: '/'
    })
    this.setState({
      isViewingSearchResult: false,
      searchedArticleList: [],
      searchString: ''
    })
    await this.fetchPopularArticles()
  }

  render() {
    const { 
      articleList,
      isSearchFocus,
      searchedArticleList,
      isViewingSearchResult,
      searchString,
      days,
      currentResultSearchString,
      isError } = this.state;

    if (isError) {
      return (
        <div className="article-list container padding-half">
          <div className="articles-wrapper">
            <div className="articles-control">
              <span className="text-in">an error has occured</span>
              <button className="btn btn-sm" onClick={() => { window.location.reload() }}>retry</button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="article-list container padding-half">
        <div className="padding-half">
          <div className="search-control">
            <form onSubmit={(e) => { this.onSubmit(e) }}>
              <input 
                onFocus={() => { this.setState({isSearchFocus: true}) }} 
                onBlur={() => { this.setState({ isSearchFocus: false }) }} 
                onChange={(e) => { this.setState({ searchString: e.target.value }) }}
                value={searchString}
                className="search-box" type="text" placeholder="Search The New York Times..." />
              <button type="submit" className="btn search-btn">Search</button>
            </form>
          </div>
        </div>
        <div className={'articles-wrapper ' + (isSearchFocus ? 'is-searching': '')}>
          { !isViewingSearchResult &&
            <>
              <h2 className="filter-text padding-double">Most Popular</h2>
              <div className="articles-control">
                <span className="text-in">most viewed in:</span>
                <button className={'btn btn-sm ' + (days === 1 ? 'is-active' : '')} onClick={() => { this.fetchPopularDay(1) }}>1 day</button>
                <button className={'btn btn-sm ' + (days === 7 ? 'is-active' : '')} onClick={() => { this.fetchPopularDay(7) }}>7 days</button>
                <button className={'btn btn-sm ' + (days === 30 ? 'is-active' : '')} onClick={() => { this.fetchPopularDay(30) }}>30 days</button>
              </div>
              <div className="article-cards">
              {articleList.map((article, i) => 
                <ArticleCard key={i} article={article} numbering={i+1}></ArticleCard>
              )}
              </div>
            </>
          }
          { isViewingSearchResult &&
            <>
              <h2 className="filter-text padding-double">Search for "{currentResultSearchString}"</h2>
              <div className="articles-control">
                <button className="btn btn-sm" onClick={() => { this.clearSearchResult() }}>clear result</button>
              </div>
              <div className="article-cards">
                {searchedArticleList.map((article, i) =>
                  <ArticleCard key={i} article={article}></ArticleCard>
                )}
              </div>
            </>
          }
        </div>
      </div>
    )
  }
}

export default ArticleList;