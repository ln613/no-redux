# no-redux

[![Build Status](https://travis-ci.org/ln613/no-redux.svg?branch=master)](https://travis-ci.org/ln613/no-redux)

A react/redux library which automates all redux flows including http calls, and store immutability is guaranteed. Redux becomes invisible to you, hence the name no-redux.

|   | redux | no-redux |
|---|---|---|
| define action type | manual | manual |
| generate action creator | manual | auto |
| call action creator in components | ‎manual | manual |
| handle action in middleware (thunk/saga...) | ‎manual | auto |
| send http request | ‎manual | auto |
| receive http response | ‎manual | auto |
| handle action in reducer | manual | auto |
| ensure store immutability | ‎manual | auto |

[slides and demo](https://ln613.github.io/no-redux)

[todo example](https://ln613.github.io/no-redux-todo-example)

[documetation](https://ln613.gitbooks.io/no-redux/)