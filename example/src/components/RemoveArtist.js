import React from 'react';
import { connect } from 'no-redux';
import actions from '../actions';
import { selector } from '../selectors';
import { Button, ButtonGroup } from 'react-bootstrap';

class RemoveArtist extends React.Component {
  render() {
    return (
      <div>
        <ButtonGroup>  
          <Button
            bsStyle="primary"
            disabled={this.props.isLoading === true}
            onClick={() => this.props.deleteArtist({ id: 5 })}
          >
            Remove id=5
          </Button>
          <Button
            bsStyle="warning"
            disabled={this.props.isLoading === true}
            onClick={() => {
              this.props.getArtists();
              this.props.setError();
            }}>
            Reset List
          </Button>
        </ButtonGroup>
        
        <div className="main">
          <div>
            {(this.props.artists || []).map(a =>
              <div>{a.id} - {a.name}</div>
            )}
          </div>

          {this.props.error ?
            <div style={{color: 'red'}}>
              {this.props.error.text}
            </div>
          : null}  
        </div>  
      </div>  
    );
  }
}

export default connect(selector, actions)(RemoveArtist);
