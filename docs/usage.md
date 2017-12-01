## Install

`npm i -S no-redux`

## Usage

**Step 1**

Define an action data object, and call "generateActions" to generate action creators.

```js
import { generateActions } from 'no-redux';

export const actionData = {
  artists: {
    url: 'http://localhost/api/artists'
  }
}

export default generateActions(actionData);
```

**Step 2**

Create a redux store by calling the "createStore" function from "no-redux" with the action data object you defined in step 1. The "createStore" function will generate reducers and middlewares that handles http calls and register them with the redux store.

```js
import React from 'react';
import { render } from 'react-dom';
import { Provider, createStore } from 'no-redux';
import { actionData } from './actions';
import App from './App';

render(
  <Provider store={createStore(actionData)}>
    <App />  
  </Provider>,
  document.getElementById('root')
);
```

**Step 3**

In your component, connect to the store with the action creators you created in step 1. When you call the action creator functions, no-redux will make http requests, get the http response and put the results on the redux store.

```js
import React from 'react';
import { connect } from 'no-redux';
import actions from './actions';

class App extends React.Component {
  componentWillMount() {
    this.props.getArtists();
  }

  render() {
    return (
      <div>
        {(this.props.artists || []).map(a => 
          <div>{a.name}</div>
        )}
      </div>
    );
  }
}

export default connect(s => ({ artists: s.artists }), actions)(App);
```
