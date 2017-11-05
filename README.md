# no-redux

[![Build Status](https://travis-ci.org/ln613/no-redux.svg?branch=master)](https://travis-ci.org/ln613/no-redux)

A react/redux library which automates all redux flows. No more action creators, reducers, thunks/sagas..., and immutability is guaranteed. Redux becomes invisible to you, hence the name no-redux.

## The Idea

Redux is great, but there is a bit of learning curve and there are lots of boiler-plate code you have to write, not just for one-time configuration, but everytime you need a new action, you have to do the follwoing:

* create an action creator to generate the action
* for http request, you have to use a redux-middleware (e.g., redux-thunk, redux-saga...) to do the following things manually:
  * handle the action
  * make the http call yourself
  * retrieve the http response
  * generate a new action with the response
* add a reducer case/function to handle the action, putting the response/payload on the store without changing the old store, and returning the new store

There are a lot of coding involved in this flow for each action you create, and you are responsible for not changing the store in the reducer. When working with deeply nested store object/arrays, it becomes a challenging job maintaining immutability. Some people use immutable.js, but it requires a big change in the way you write code in javascript due to a different data structure, which also makes it hard to work with other javascript libraries.

Wouldn't it be good if we can automate all the tasks above and guarantee the immutability of the store?

That's exactly what no-redux brings to the table. With no-redux, you only need to define an object for each action containing the information needed to dispatch it, like the url and parameters, then no-redux will generate the corresponding action creators, http request/response routines (no-redux uses redux-cycles for http handling), reducers and guarantees the immutability when returning the new store.

No-redux also provides a createStore function for the initial configuration, so you don't need to install or import redux/thunk/saga... any more, redux becomes invisible to you. For redux beginners, with no-redux, you don't even need to fully understand redux to use redux.

## Install

`npm i -S no-redux`

## Usage

### Step 1

Create a declarative action data file.

```js

import { generateActions } from 'no-redux';

export const actionData = {
  artists: {
    url: 'http://localhost/api/artists'
  }
}

export default generateActions(actionData);

```

### Step 2

Create a redux store by calling the createStore function from 'no-redux' with the action data object you defined in step 1.

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

### Step 3

In your component, connect to the store with the action creators you created in step 1. When you call the action creator functions, no-redux will generate the actions, make http requests, get the http response and put the results on the redux store.

```js

import React from 'react';
import { connect } from 'no-redux';
import actions from '../actions';

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


