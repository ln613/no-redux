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