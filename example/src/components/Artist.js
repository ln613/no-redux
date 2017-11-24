import React from 'react';
import { connect } from 'no-redux';
import actions from '../actions';
import { selector } from '../selectors';
import { Button, ButtonGroup } from 'react-bootstrap';

class Artist extends React.Component {
  render() {
    const artist = this.props.currentArtist;
    
    return (
      <div>
        <ButtonGroup>
          <Button
            bsStyle="primary"
            disabled={this.props.isLoading === true}
            onClick={() => this.props.getCurrentArtist({ id: 5 })}>
            Load Artist
          </Button>
          <Button
            bsStyle="warning"
            onClick={() => this.props.setCurrentArtist()}>
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

export default connect(selector, actions)(Artist);
