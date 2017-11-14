import React from 'react';
import { connect } from 'no-redux';
import actions from '../actions';
import { Button, ButtonGroup } from 'react-bootstrap';

class Artist extends React.Component {
  render() {
    const artist = this.props.artist;
    
    return (
      <div>
        <ButtonGroup>
          <Button
            bsStyle="primary"
            onClick={() => this.props.getArtist({ id: 5 })}>
            Load Artist
          </Button>
          <Button
            bsStyle="warning"
            onClick={() => this.props.setArtist()}>
            Clear Artist
          </Button>
        </ButtonGroup>
        
        <div className="main">
          {artist
            ? `${artist.name}: ${artist.albums.length} albums`
            : null
          }
        </div>
      </div>  
    );
  }
}

export default connect(s => ({ artist: s.artist }), actions)(Artist);
