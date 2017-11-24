import React from 'react';
import { connect } from 'no-redux';
import actions from '../actions';
import { selector } from '../selectors';
import { Button, ButtonGroup } from 'react-bootstrap';

class Artists extends React.Component {
  render() {
    return (
      <div>
        <ButtonGroup>
          <Button
            bsStyle="primary"
            disabled={this.props.isLoading === true}
            onClick={() => this.props.getArtists()}>
            Load Artists
          </Button>
          <Button
            bsStyle="warning"
            onClick={() => this.props.setArtists()}>
            Clear Artists
          </Button>
        </ButtonGroup>  
        
        <div className="main">
          {(this.props.artists || []).map(a => 
            <div>{a.id} - {a.name}</div>
          )}
        </div>
      </div>  
    );
  }
}

export default connect(selector, actions)(Artists);
