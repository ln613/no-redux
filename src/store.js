import { is, isEmpty, fromPairs } from 'ramda';
import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import { run } from '@cycle/run';
import { createCycleMiddleware } from 'redux-cycles';
import { makeHTTPDriver } from '@cycle/http';
import { combineCycles } from 'redux-cycles';
import generateReducer from './reducer';
import generateCycles from './cycles';

export default (actionData, initialState = {}) => {
  const cycleMiddleware = createCycleMiddleware();

  const middewares = [
    cycleMiddleware,
  ];

  const reducers = isDataArray(actionData)
    ? combineReducers(fromPairs(
      Object.keys(actionData).map(r =>
        [r, generateReducer(actionData[r])]
      )
    ))
    : generateReducer(actionData);
  
  const store = createStore(reducers, initialState, compose(
    applyMiddleware(...middewares),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));

  run(combineCycles(...generateCycles(actionData)), {
    ACTION: cycleMiddleware.makeActionDriver(),
    //STATE: cycleMiddleware.makeStateDriver(),
    HTTP: makeHTTPDriver(),
  });

  return store;
}

const isDataArray = d =>
  is(Object, d) &&
  Object.keys(d).every(x =>
    is(Object, d[x]) &&
    isEmpty(d[x]) &&
    Object.keys(d[x]).every(y => is(Object, d[x][y]))
  );
