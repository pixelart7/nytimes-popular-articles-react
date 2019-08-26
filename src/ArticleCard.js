import React from 'react';

import './ArticleCard.scss';

import MediaDisplay from './MediaDisplay';

class ArticleCard extends React.Component {
  render() {
    const { article, numbering } = this.props;
    let cardInner = ''

    if (Object.keys(article).length === 0) {
      cardInner =
        <>
          <div className="preload meta">
            <div className="line line-1"></div>
            <div className="line line-2"></div>
            <div className="line line-3"></div>
            <div className="line line-time"></div>
          </div>
          <div className="preload media-display"></div>
        </>
    } else {
      if (!{}.hasOwnProperty.call(article, 'url')) article.url = article.web_url
      cardInner =
        <>
          <span className="badge-numbering">{numbering}</span>
          <div className="meta">
            {{}.hasOwnProperty.call(article, 'section') && <span className="badge-section">{article.section}</span> }
            {{}.hasOwnProperty.call(article, 'section_name') && <span className="badge-section">{article.section_name}</span> }
            {{}.hasOwnProperty.call(article, 'title') && <h4>{article.title}</h4>}
            {{}.hasOwnProperty.call(article, 'headline') && <h4>{article.headline.main}</h4>}
            
            {{}.hasOwnProperty.call(article, 'published_date') && 
                <time dateTime={article.published_date}>{new Date(article.published_date).toDateString()}</time>
              }
            {{}.hasOwnProperty.call(article, 'pub_date') && 
              <time dateTime={article.pub_date}>{new Date(article.pub_date).toDateString()}</time>
            }
          </div>
          { {}.hasOwnProperty.call(article, 'media') && <MediaDisplay media={article.media[0]}></MediaDisplay> }
        </>
    }

    return (
      <a href={article.url} className={"article-card " + ((Object.keys(article).length > 0)? "loaded": "") }>
        {cardInner}
      </a>
    )
  }
}

export default ArticleCard;