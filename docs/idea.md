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
