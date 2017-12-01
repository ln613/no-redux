# no-redux

[![Build Status](https://travis-ci.org/ln613/no-redux.svg?branch=master)](https://travis-ci.org/ln613/no-redux)

A react/redux library which automates all redux flows including http calls. No more action creators, reducers, thunks/sagas..., and immutability is guaranteed. Redux becomes invisible to you, hence the name no-redux.

[slides and demo](https://ln613.github.io/no-redux)

[todo example](https://ln613.github.io/no-redux-todo-example)

## Table of Contents

  * [The idea](#the-idea)
  * [Install](#install)
  * [Usage](#usage)
  * [Define action data](#define-action-data)
    * [Action object properties](#action-object-properties)
    * [The url property](#the-url-property)
    * [The method property](#the-method-property)
    * [The methods property](#the-methods-property)
    * [Generate action creators with generateActions](#generate-action-creators-with-generateactions)
    * [Use the after property to specify a different payload](#use-the-after-property-to-specify-a-different-payload)
    * [Define parameters in the url or path property](#define-parameters-in-the-url-or-path-property)
    * [Use the body function as a body creator](#use-the-body-function-as-a-body-creator)
    * [Pre-defined actions](#pre-defined-actions)
      * [Handle http errors](#handle-http-errors)
      * [isLoading flag](#isloading-flag)
  * [Update nested store object with path](#update-nested-store-object-with-path)
    * [Locate an array element in the path](#locate-an-array-element-in-the-path)
    * [Add element to an array](#add-element-to-an-array)
    * [Remove element from an array](#remove-element-from-an-array)
  * [Use selectors for derived data](#use-selectors-for-derived-data)
  * [Multiple reducers](#multiple-reducers)
  * [External reducers and middlewares](#external-reducers-and-middlewares)



## The idea

Redux is great, but the amount of boiler-plate code (not just for one-time configuration, but everytime you add a new action) and the challenge to keep the state immutable make it not so easy to use.

One philosophy behind Redux is that the store should only keep the minimal raw data, any derived/computed data should be done in the mapStateToProps stage with selectors. If you are using reselect, you are already familiar with this concept.

As a result, the reducers will be simplified to do one thing only - putting the payload on the store, thus a good candidate for automation, along with http handling middlewares (e.g., redux-thunk, redux-saga...) and action creators.

No-redux automates all these redux procedures, and guarantees the immutability of the store.

With no-redux, all you need to do is define an object for each action containing the information needed to dispatch it, like url and parameters, then no-redux will help you:

* Generate action creators
* Make http requests
* Receive http responses
* Generate reducers to put payload/response on the store
* Guarantee store immutability
* 'Memoize' selectors

No-redux also provides a createStore function for the initial configuration, so you don't need to install or import redux/thunk/saga... any more, redux becomes invisible to you. For redux beginners, with no-redux, you don't even need to fully understand redux to use redux.

## Install

`npm i -S no-redux`

## Usage

**Step 1**

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

**Step 2**

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

**Step 3**

In your component, connect to the store with the action creators you created in step 1. When you call the action creator functions, no-redux will generate the actions, make http requests, get the http response and put the results on the redux store.

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

## Define action data

### Action object properties

When you define an action object, these are the available properties:

* [url](#url)
* [method](#method)
* [methods](#methods)
* [path](#update-nested-store-object-with-path)
* [after, afterGet, afterPost, afterPut, afterPatch, afterDelete](#use-the-after-property-to-specify-a-different-payload)
* [body](#use-the-body-property-as-a-body-creator-for-post)
* other http properties (headers, accept, user, password, attach..., please check [cyclejs http doc](https://cycle.js.org/api/http.html#api) for more info)

### The url property

If there is an url property, then it's an http action, otherwise it's a store action.

### The method property

The http method (get, post, put, patch, delete...). The default value is 'get'.

### The methods property

Define more than one method, in a string array, e.g., ['get', 'post']. If both methods and method are defined, the method will be ignored.

### Generate action creators with generateActions

Assuming we have defined an action object named artist.

The generateActions function will generate a setArtist action creator, which will be used for setting the artist property on the redux store.

If the artist action has a url property (an http action), the generateActions function will generate one action creator for each http method you define with the method or methods property, e.g., getArtist, postArtist, putArtist, patchArtist and deleteArtist, which will be used for making http calls.

After the http response is received, the setArtist function will be called.

For get http actions, the http response will be put on the store.

For post, put or patch http actions, the body you send to the server will be put on the store, and the http response will be ignored.

For delete http actions, the object will be removed from the store.

The get/delete function takes one parameter - 'params', which contains values for the parameters defined in the url or path properties.

The post/put/patch function takes two parameters - 'body' and 'params'. 'body' is the object that will be posted to the server.

The set function takes two parameters - 'payload' and 'params'. 'payload' is the value/object that will be put on the store.

### Use the after property to specify a different payload

If you want to change the default behavior on what is going to be put on the store after the http response is received, you can provide an 'after' function to generate the payload based on the response and the body you send to the server, which are the two parameters to the after function.

For example, if the http response is:

```js
{ success: true, insertedAlbum: ... }
```

You can change the payload:

```js
after: response => response.insertedAlbum
```

There are 5 functions for each http method - afterGet, afterPost, afterPut, afterPatch, afterDelete, and there is also a generic version - after, which applies to all http actions.

If you specify both the specific and the generic versions, the generic version will be ignored for that specific http method.

For example, if you specify afterPost and after, then for the post action, afterPost will be called, and for the get action, the after will be called.
### Define parameters in the url or path property

You can define parameters in the url or path property:

```js
album: {
  url: 'http://localhost/api/artist/{artistId}/album/{albumId}',
  method: ['put', 'patch', 'delete'],
  path: 'artist[id={artistId}].album[id={albumId}]'
}
```

Then you can call the action creator with the values of the parameters.

```js
this.props.patchAlbum(
  { rate: 80 },
  { artistId: 5, albumId: 3 }
)
```

### Use the body function as a body creator

You can provide a function to generate the body for post/put/patch http actions if the body is complicated or has a lot of default values. This way, you don't have to provide the whole body everytime you call the action creator. For example,

```js
newArtist: {
  url: 'http://localhost/api/newartist',
  method: 'post',
  body: p => ({
    albums: [],
    rate: 50,
    ...p
  })
}
```

Then call it like:

```js
this.props.postNewArtist({
  id: 5,
  name: 'Michael Jackson',
  rate: 80
})
```
### Pre-defined actions

#### Handle http errors

If there are errors thrown during http calls (404, 500...), no-redux will put the error on the store under the 'error' property.

Everytime a new http request is made, the 'error' property will be set to null. You can also clear the 'error' property by calling:

```js
this.props.setError();
```

#### isLoading flag

Everytime a new http request is made, the 'isLoading' property will be set to true. Everytime a http response is received (or a http error is thrown), the 'isLoading' property will be set to false. You can use this flag to show/hide your loading screen.

You can also clear the 'isLoading' property by calling:

```js
this.props.setIsLoading();
```

## Update nested store object with path

When it comes to updating a value in a deeply nested store object, keeping it immutable is a challenge. No-redux provides a way for you to define a path to locate the property or sub-object you want to update/insert/delete, and return a new state without modifying the old one.

If the path property is not provided, it will be the action object name, which means the payload will be put on the store under that name.

### Locate an array element in the path

When locating an array element, you can:

* specify a zero-based index, like 'artists[2]', or
* specify a key/value pair, like 'artists[id=5]', no-redux will find the first object in the artists list with the id property equals to 5.

For string values, no quotes needed - 'artists[name=Michael Jackson]'.

It can be parameterized, like 'artists[id={id}]'. And if the name of the property is the same as the name of the parameter, it can be shortened as 'artists[id]'.

Sometimes it's useful to define different parameter names to avoid name conflict, 'artists[name={artistName}].albums[name={albumName}]'.

Let's look at an example. If you want to update the rate of an album in the store, first define an action object:

```js
rate: {
  path: 'artists[id].albums[name].rate',
},
```

Then call the setRate function with payload and params:

```js
this.props.setRate(88, { id: 5, name: 'Bad' });
```

### Add element to an array

If you leave the array element locator empty, it means you want to add a new element to the array:

```js
album: {
  path: 'artists[id].albums[]',
}
...
this.props.setAlbum({ name: "Off the Wall", year: 1979 }, { id: 5 })
```

You can also specify the locator, but do not provide a value for the parameter, it also means you want to insert the element to the array.

```js
album: {
  path: 'artists[id].albums[name]',
}
...
this.props.setAlbum({ name: "Off the Wall", year: 1979 }, { id: 5 })
```

### Remove element from an array

If you update the array element with 'null', that element will be removed from the array.

```js
album: {
  path: 'artists[id].albums[name]',
}
...
this.props.setAlbum(null, { id: 5, name: 'Bad' })
```

As you can see, you can define just one action object to achieve all update/insert/delete functionalities, or you can define an action object for each functionality.

## Use selectors for derived data

Since the store only keeps the minimal raw data, any derived/computed data should be done in the mapStateToProps stage with selectors.

```js
import { createSelector, mapStateWithSelectors } from 'no-redux';
import { sortBy, prop } from 'ramda';

const artists = s => s.artists || [];
const filter = s => s.filter || '';
const sortByProp = s => s.sortByProp || '';
const isLoading = s => s.isLoading;

const filteredArtists = createSelector(
  artists,
  filter,
  (l, f) => l.filter(x => x.name.indexOf(f) > -1)
);

const sortedArtists = createSelector(
  filteredArtists,
  sortByProp,
  (l, p) => sortBy(prop(p), l)
);

export const artistsSelector = mapStateWithSelectors({
  artists: sortedArtists,
  isLoading
});

```

Then in the component:

```js
import { artistsSelector } from './selectors';
...
export default connect(artistsSelector, actions)(App);
```

The createSelector function allows you to combine selectors by taking the results of all but the last selector and sending them to the last selector as input.

The createSelector function has the 'memoize' feature, which means it will cache the previous result, and return the cached result without recalculation if the parameters are the same (based on reference equality). This will greatly improve performance by avoiding recalculation if unrelated data is changed in the store, especially when the business logic in the selector is complex and time consuming.

The mapStateWithSelectors function is just a helper function to generate the mapStateToProps function. In the above example, the mapStateWithSelectors function will generate the following function:

```js
state => ({
  artists: sortedArtists(state),
  isLoading: isLoading(state)
});
```

## Multiple reducers

No-redux will generate one reducer for each action data object you define. When there is more than one action data object/reducer, you have to give each one a name, just like what you do with combineReducers from redux.

```js
export const musicActions = {
  artists: {
    url: 'http://localhost/api/artists'
  },
  ...
}

export const movieActions = {
  movies: {
    url: 'http://localhost/api/movies'
  },
  ...
}

export const musicActionCreators = generateActions(musicActions);
export const movieActionCreators = generateActions(movieActions);
```

Then in your index.js file:

```js
...
<Provider store={createStore({
  music: musicActions,
  movie: movieActions
})}>
...
```

Then in your selectors, you also need to select from the corresponding reducer:

```js
const artists = s => s.music.artists || [];
...
const movies = s => s.movie.movies || [];
```

## External reducers and middlewares

If you encounter scenarios or functionalities that no-redux does not cover, you can still use regular reducers and redux middlewares like redux-saga, together with no-redux.

The createStore function provided by no-redux has four parameters. The third is the external reducers, and the fourth is the external middlewares.

```js
const exReducer = (s = { p1: 5 }, a) => {
  switch (a.type) {
    case 'P1':
      return Object.assign({}, s, { p1: a.payload });
    default:
      return s;  
  }
}

const saga = function* () {
  yield [
    takeEvery('P2', function* (a) {
      yield put({ type: 'P1', payload: 10 });
    }),
  ]
}

const sagaMiddleware = createSagaMiddleware();

const store = createStore({ music: musicAction }, {}, { exReducer }, [sagaMiddleware]);

sagaMiddleware.run(saga);

...
<Provider store={store}>
...
```