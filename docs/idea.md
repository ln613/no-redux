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
