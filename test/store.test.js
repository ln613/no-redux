import createStore from '../src/store';
import generateActions from '../src/actions';
import { append } from 'ramda';
// import createSagaMiddleware, { takeEvery } from 'redux-saga';
// import { put } from 'redux-saga/effects';

const api = 'https://my-json-server.typicode.com/ln613/no-redux/';

const actionData = {
  artists: {
    url: api + 'artists',
    methods: ['get', 'post']
  },
  artist: {
    url: api + 'artist/{id}',
    methods: ['put', 'patch', 'delete'],
    path: 'artists[id]'
  },
  year: {
    path: 'artists[id].albums[name].year'
  },
  rate: {
    path: 'artists[id].rate'
  },
  album: {
    path: 'artists[id].albums[name]'
  },
};

const artists = [
  {
    id: 3,
    name: 'Phil Collins',
    albums: [
      { id: 1, name: 'Face Value', year: 1981 },
      { id: 2, name: 'No Jacket Required', year: 1985 },
    ]
  },
  {
    id: 5,
    name: 'Michael Jackson',
    albums: [
      { id: 3, name: 'Off the Wall', year: 1979 },
      { id: 4, name: 'Bad', year: 1988 },
    ]
  },
];

const store = createStore(actionData);

const actions = generateActions(actionData);

test('generate action creators', () => {
  expect(actions).toEqual(expect.objectContaining({
    getArtists: expect.any(Function),
    postArtists: expect.any(Function),
    setArtists: expect.any(Function),
    putArtist: expect.any(Function),
    patchArtist: expect.any(Function),
    deleteArtist: expect.any(Function),
    setArtist: expect.any(Function),
    setYear: expect.any(Function),
  }));
});

test('call action creators', () => {
  expect(actions.setArtists(artists)).toEqual({
    type: 'setArtists',
    payload: artists,
    path: 'artists',
    params: undefined
  });
});

test('store', () => {
  store.dispatch(actions.setArtists(artists));
  expect(store.getState()).toMatchObject({ artists });
  
  store.dispatch(actions.setYear(1987, { id: 5, name: 'Bad' }));
  expect(store.getState().artists[1].albums[1].year).toBe(1987);

  const newAlbum = { name: 'Dangerous', year: 1991 };
  store.dispatch(actions.setAlbum(newAlbum, { id: 5 }));
  expect(store.getState().artists[1].albums[2]).toMatchObject(newAlbum);

  expect(store.getState().artists[1].albums.findIndex(x => x.name === 'Bad')).toEqual(1);
  store.dispatch(actions.setAlbum(null, { id: 5, name: 'Bad' }));
  expect(store.getState().artists[1].albums.findIndex(x => x.name === 'Bad')).toEqual(-1);

  store.dispatch(actions.setArtists());
  expect(store.getState().artists).toBeNull();
});

// http

const testHttp = (title, action, val, exp) => {
  test(title, done => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      if (!state.isLoading) {
        try {
          expect(val(state)).toMatchObject(exp);
          done();
        }
        catch (e) {
          done(e);
        }
        finally {
          unsubscribe();          
        }
      }  
    });
  
    store.dispatch(action);
  });
}

const newArtist = { id: 7, name: 'Elton John' };
const newArtists = append(newArtist, artists);

store.dispatch(actions.setArtists());
testHttp(
  'http - post to empty array',
  actions.postArtists(newArtist),
  s => s.artists,
  [newArtist]
);

testHttp(
  'http - get array',
  actions.getArtists(),
  s => s.artists,
  artists
);

testHttp(
  'http - post to existing array',
  actions.postArtists(newArtist),
  s => s.artists,
  newArtists
);

testHttp(
  'http - put',
  actions.putArtist(newArtist, { id: 3 }),
  s => s.artists[0],
  newArtist
);

const patchObj = { rate: 80, name: 'MJ' };
const afterPatchObj = Object.assign({}, artists[1], patchObj);
testHttp(
  'http - patch',
  actions.patchArtist(patchObj, { id: 5 }),
  s => s.artists[1],
  afterPatchObj
);

testHttp(
  'http - delete',
  actions.deleteArtist({ id: 7 }),
  s => s.artists,
  [afterPatchObj, newArtist]
);

// multi reducers

const actionData1 = {
  actors: ({}),
  movieName: {
    path: 'actors[id].movies[name].name'
  }
}

const actors = [
  {
    id: 2,
    name: 'Tom Cruise',
    movies: [
      { id: 1, name: 'Top Gun', year: 1986 },
      { id: 2, name: 'The Mummy', year: 2017 },
    ]
  },
  {
    id: 4,
    name: 'Harrison Ford',
    movies: [
      { id: 3, name: 'Blade Runner', year: 1982 },
      { id: 4, name: 'Star Wars', year: 1977 },
    ]
  },
];

const store1 = createStore({ music: actionData, movie: actionData1 });

const actions1 = generateActions(actionData1);

test('multi reducers', () => {
  expect(store1.getState()).toMatchObject({ music: {}, movie: {} });

  store1.dispatch(actions1.setActors(actors));
  store1.dispatch(actions1.setMovieName('Star Wars: A New Hope', { id: 4, name: 'Star Wars' }));
  expect(store1.getState().movie.actors[1].movies[1].name).toBe('Star Wars: A New Hope');
});

// external reducers

const reducer1 = (s = { p1: 5 }, a) => {
  switch (a.type) {
    case 'P1':
      return Object.assign({}, s, { p1: a.payload });
    default:
      return s;  
  }
}

const store2 = createStore({ music: actionData }, {}, { reducer1 });

test('extra reducers', () => {
  expect(() => createStore(actionData, {}, { reducer1 })).toThrow('A name must be provided for the default reducer.');

  // initial state
  const initState = { reducer1: { p2: 2 }, music: { p1: 1 } };
  expect(createStore({ music: actionData }, initState, { reducer1 }).getState()).toMatchObject(initState);

  expect(store2.getState()).toMatchObject({ music: {}, reducer1: { p1: 5 } });

  const newArtist = { id: 7, name: 'Elton John' };
  store2.dispatch(actions.setArtists(artists));
  store2.dispatch(actions.setArtist(newArtist, { id: 3 }));
  expect(store2.getState().music.artists[0]).toMatchObject(newArtist);

  store2.dispatch({ type: 'P1', payload: 9 });
  expect(store2.getState().reducer1.p1).toBe(9);  
});


// external middlewares (saga), intsall redux-saga to run the test below

// const saga = function* () {
//   yield [
//     takeEvery('RANDOM_RATE', function* (a) {
//       yield put(actions.setRate(Math.floor(Math.random() * 100) + 1, { id: a.id }));
//     }),
//     takeEvery('P2', function* (a) {
//       yield put({ type: 'P1', payload: 10 });
//     }),
//   ]
// }

// const sagamw = createSagaMiddleware();

// const store3 = createStore({ music: actionData }, {}, { reducer1 }, [sagamw]);

// sagamw.run(saga);

// test('extra middlewares (saga)', () => {
//   store3.dispatch(actions.setArtists(artists));
//   store3.dispatch({ type: 'RANDOM_RATE', id: 3 });
//   expect(store3.getState().music.artists[0].rate).toBeLessThanOrEqual(100);

//   store3.dispatch({ type: 'P2' });
//   expect(store3.getState().reducer1.p1).toBe(10);  
// });
