import { is, isEmpty, fromPairs, append } from 'ramda';
import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import { run } from '@cycle/run';
import { createCycleMiddleware } from 'redux-cycles';
import { makeHTTPDriver } from '@cycle/http';
import { combineCycles } from 'redux-cycles';
import generateReducer from './reducer';
import generateCycles from './cycles';

export default (actionData, initialState = {}, extraReducers = {}, extraMiddlewares = []) => {
  const cycleMiddleware = createCycleMiddleware();

  const middewares = append(cycleMiddleware, extraMiddlewares);

  const isArr = isDataArray(actionData);

  const exReducerKeys = Object.keys(extraReducers);

  if (exReducerKeys.length > 0 && !isArr)
    throw new Error('A name must be provided for the default reducer.');
  
  const reducers = !isArr
    ? generateReducer(actionData)
    : combineReducers(Object.assign({},
        fromPairs(
          Object.keys(actionData).map(r =>
            [r, generateReducer(actionData[r])]
          )
        ),
        extraReducers  
      ));
  
  const store = createStore(reducers, initialState, compose(
    applyMiddleware(...middewares),
    process && process.env && process.env.NODE_ENV === 'development' && window.devToolsExtension
      ? window.devToolsExtension()
      : f => f
  ));

  run(combineCycles(...generateCycles(actionData)), {
    ACTION: cycleMiddleware.makeActionDriver(),
    HTTP: makeHTTPDriver(),
  });

  return store;
}

const isDataArray = d =>
  is(Object, d) &&
  Object.keys(d).every(x =>
    is(Object, d[x]) &&
    !isEmpty(d[x]) &&
    Object.keys(d[x]).every(y => is(Object, d[x][y]))
  );
