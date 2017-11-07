# no-redux

[![Build Status](https://travis-ci.org/ln613/no-redux.svg?branch=master)](https://travis-ci.org/ln613/no-redux)

A react/redux library which automates all redux flows. No more action creators, reducers, thunks/sagas..., and immutability is guaranteed. Redux becomes invisible to you, hence the name no-redux.

### Table of Contents

* [The idea](#the-idea)
* [Install](#install)
* [Usage](#usage)
* [Define action data](#define-action-data)
  * [Action object properties](#action-object-properties)
  * [Store action vs http action](#store-action-vs-http-action)
  * [Get http action vs post http action](#get-http-action-vs-post-http-action)
  * [Generate action creators with generateActions](#generate-action-creators-with-generateactions)
    * [get action creator](#get-action-creator)
    * [post action creator](#post-action-creator)
    * [set action creator](#set-action-creator)
  * [Use the after property to specify a different payload](#use-the-after-property-to-specify-a-different-payload)
  * [Define parameters in the url or path property](#define-parameters-in-the-url-or-path-property)
  * [Use the body property as a body creator for post](#use-the-body-property-as-a-body-creator-for-post)
  * [Pre-defined actions](#pre-defined-actions)
    * [Handle http errors](#handle-http-errors)
    * [isLoading flag](#isloading-flag)
* [Update nested store object with path](#update-nested-store-object-with-path)
  * [Locate an array element in the path](#locate-an-array-element-in-the-path)
  * [Add element to an array](#add-element-to-an-array)
  * [Remove element from an array](#remove-element-from-an-array)
  * [Save the changes to the server and update the state](#save-the-changes-to-the-server-and-update-the-state)
* [Use selectors for derived data](#use-selectors-for-derived-data)
* [Multiple reducers](#multiple-reducers)
* [External reducers and middlewares](#external-reducers-and-middlewares)


## The idea

Redux is great, but there is a bit of learning curve and there are lots of boiler-plate code you have to write, not just for one-time configuration, but everytime you need a new action, you have to do the follwoing:

* create an action creator to generate the action
* for http request, you have to use a redux-middleware (e.g., redux-thunk, redux-saga...) to do the following things manually:
  * handle the action
  * make the http call yourself
  * retrieve the http response
  * generate a new action with the response
* add a reducer case/function to handle the action, putting the response/payload on the store without changing the old store, and returning the new store

There is a lot of coding involved in this flow for each action you create, and you are responsible for not changing the store in the reducer. When working with deeply nested store object/arrays, it becomes a challenging job maintaining immutability. Some people use immutable.js, but it requires a big change in the way you write code in javascript due to a different data structure, which also makes it hard to work with other javascript libraries.

Wouldn't it be great if we can automate all the tasks above and guarantee the immutability of the store?

That's exactly what no-redux brings to the table. With no-redux, you only need to define an object for each action containing the information needed to dispatch it, like the url and parameters, then no-redux will generate the corresponding action creators, http request/response routines (no-redux uses redux-cycles for http handling), reducers and guarantees the immutability when returning the new store.

The philosophy behind is that the store should only keep the minimal raw data, any derived/computed data should be done in the mapStateToProps stage with selectors. If you are using reselect, you are already familiar with this concept.

This way, the reducers will be simplified to do 1 thing only - putting the payload on the store, thus a good candidate for automation, along with http handling middlewares and action creators.

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

## Define action data

### Action object properties

When you define an action object, these are the available properties:

* [url](#store-action-vs-http-action)
* [method](#get-http-action-vs-post-http-action)
* [path](#update-nested-store-object-with-path)
* [after](#use-the-after-property-to-specify-a-different-payload)
* [body](#use-the-body-property-as-a-body-creator-for-post)
* other http properties (headers, accept, user, password, attach..., please check [cyclejs http doc](https://cycle.js.org/api/http.html) for more info)

### Store action vs http action

If there is an url property, then it's a http action, otherwise it's a store action.

### Get http action vs post http action

If the method property is 'post', it's a post http action, otherwise it's a get http action.

### Generate action creators with generateActions

The 'generateActions' function will generate 2 action creators for each http action, 1 action creator for each store action.

#### get action creator

For each get http action, an action creator function with the name 'get + object name' will be created. For example, if you have an action object named 'artist', then an action creator function named 'getArtist' will be created.

The 'get' function will take 1 parameter - 'params' which contains values for the parameters defined in the url or path properties.

#### post action creator

For each post http action, an action creator function with the name 'post + object name' will be created. For example, if you have an action object named 'saveArtist', then an action creator function named 'postSaveArtist' will be created.

The 'post' function will take 2 parameters - 'body' and 'params', and 'body' will be the object that will be posted to the server.

#### set action creator

For both store actions and http actions, an action creator function with the name 'set + object name' will be created. For example, if you have an action object named 'artist', then an action creator function named 'setArtist' will be created.

The 'set' function will take 2 parameters - 'payload' and 'params', and 'payload' will be the value/object that will be put on the store.

For http actions, when you call the 'get/post' action creators, the http request will be made. And when the response is back, no-redux will call the corresponding 'set' action creator with the http response as the payload.

### Use the after property to specify a different payload

If the http response is not the payload you want to put on the store, you can provide a function to generate the payload based on the response and the body (if it's a post request).

For example, if the http response is:

```js
{ success: true, insertedAlbum: ... }
```

You can change the payload:

```js
after: response => response.insertedAlbum
```

### Define parameters in the url or path property

You can define parameters in the url or path property:

```js
url: 'http://localhost/api/updateAlbumRate/{artist}/{album}/{rate}',
path: 'artist.album[id].rate'
```

Then you can call the action creator with the values of the parameters.

```js
this.props.getUpdateAlbumRate({
  artist: 'Michael Jackson',
  album: 'Bad',
  rate: 88,
  id: 5
})
```

The name 'getUpdateAlbumRate' may seem odd in this example since it's an update request. The 'get' prefix doesn't mean it's getting something from the server, it simply indicates that this is a http get request, not a http post.

### Use the body property as a body creator for post

You can provide a function to generate the body for the post http action if the body is complicated. This way, you don't have to provide the whole body everytime you call the action creator, just the parameters.

### Pre-defined actions

#### Handle http errors

If there are errors thrown during http calls (404, 502...), no-redux will put the error on the store under the 'error' property.

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

Then call the setPath function with payload and params:

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

As you can see, you can define just 1 action object to achieve all update/insert/delete functionalities, or you can define an action object for each functionality.

### Save the changes to the server and update the state

Add a url to the above action object, then you can save the changes to the server and update the state at the same time.

```js
newAlbum: {
  url: 'http://localhost/api/addAlbum/{id}',
  method: 'post',
  path: 'artists[id].albums[]',
}
...
this.props.postNewAlbum({ name: 'Off the Wall', year: '1979' }, { id: 5 })
```

This works when the http response is the same as the payload. If the service api is designed differently, you can use the after property to define the payload.

```js
newAlbum: {
  url: 'http://localhost/api/addAlbum',
  method: 'post',
  path: 'artists[id].albums[]',
  after: response => response.newAlbum
}
...
this.props.postNewAlbum({
  artistId: 5,
  newAlbum: { name: 'Off the Wall', year: '1979' }
 }, { id: 5 })
```

Or if the server doesn't return the original object, you can still access it from the body.

```js
after: (response, body) => body.newAlbum
```

## Use selectors for derived data

## Multiple reducers

## External reducers and middlewares

*...to be continued*