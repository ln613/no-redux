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
  artists: filteredArtists,
  isLoading
});

```

```js
import { artistsSelector } from './selectors';
...
export default connect(artistsSelector, actions)(App);
```

The createSelector function allows you to combine selectors by taking the results of all but the last selector and sending them to the last selector as input.

The createSelector function has the 'memoize' feature, which means it will cache the previous result, and return the cached result without recalculation if the parameters are the same (based on reference equality). This will greatly improve performance by avoiding recalculation if unrelated data is changed in the store, especially when the business logic is complex and time consuming.

The mapStateWithSelectors function is just a helper function to generate the mapStateToProps function. So in the above example, the mapStateWithSelectors function will generate the following function:

```js
state => ({
  artists: filteredArtists(state),
  isLoading: isLoading(state)
});
```
