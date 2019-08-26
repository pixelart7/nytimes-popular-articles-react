import React from 'react';

import './MediaDisplay.scss';

class MediaDisplay extends React.Component {
  render() {
    const { media } = this.props;

    return (
      <div className="media-display">
        <div className="img-preload"></div>
        { media !== undefined &&
          <>
            <img className="blurable" src={media['media-metadata'][2].url} alt={media.caption} aria-hidden="true"></img>
            <img className="main" srcSet={
              media['media-metadata'][1].url + ' 210w,' +
              media['media-metadata'][2].url + ' 440w'
            } sizes="(max-width: )" src={media['media-metadata'][2].url} alt={media.caption}></img>
          </>
        }
      </div>
    )
  }
}

export default MediaDisplay;