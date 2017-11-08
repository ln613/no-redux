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
