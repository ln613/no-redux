import { fromPairs, reduce, isNil } from 'ramda';
import { parsePath, toHttpMethods, toSet, replace, attachDefault, hasBody } from './common';

const createAction = (t, action) => {
  const type = toSet(t);
  return [
    type,
    (payload, params) => ({
      type,
      path: parsePath(action.path, t),
      payload: isNil(payload) ? null : payload,
      params
    })
  ];
};

const createHttpActions = (t, action) => {
  const types = toHttpMethods(t, action);

  const fn = type => (body, params) => {
    if (!params && !hasBody(type[0])) {
      params = body;
      body = null;
    }
    
    return {
      type: type[1],
      url: replace(action.url, params),
      path: parsePath(action.path, t, type[0]),
      params,
      body: body && (action.body ? action.body(body) : body)
    }
  };

  return types.map(type => [type[1], fn(type)]);
};

export default l => {
  l = attachDefault(l);
  return fromPairs(reduce((p, c) => {
    const a1 = createAction(c, l[c]);
    return l[c].url
      ? [...p, ...createHttpActions(c, l[c]), a1]
      : [...p, a1];
  }, [], Object.keys(l)));
};
