import React from 'react';
import { connect } from 'no-redux';
import actions from '../actions';
import { selector } from '../selectors';
import { Button, ButtonGroup } from 'react-bootstrap';

class NewArtist extends React.Component {
  getNewId = () =>
    this.props.artists
      ? Math.max.apply(null, this.props.artists.map(x => x.id)) + 1
      : 1;
  
  render() {
    return (
      <div className="main">
        <div className="spacer" />
        <div>
          <input ref="name" />
        </div>
        <div className="spacer" />
        
        <ButtonGroup>  
          <Button
            bsStyle="primary"
            disabled={this.props.isLoading === true}
            onClick={() => this.props.postNewArtist({
              id: this.getNewId(),
              name: this.refs.name.value
            })}>
            Add Artist
          </Button>
          <Button
            bsStyle="warning"
            disabled={this.props.isLoading === true}
            onClick={() => this.props.getArtists()}>
            Reset List
          </Button>
        </ButtonGroup>  
        
        <div>
          {(this.props.artists || []).map(a => 
            <div>{a.id} - {a.name}</div>
          )}
        </div>
      </div>  
    );
  }
}

export default connect(selector, actions)(NewArtist);
