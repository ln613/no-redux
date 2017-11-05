import { fromPairs, reduce, isNil } from 'ramda';
import { parsePath, toGet, toSet, isPost, replace, attachDefault } from './common';

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

const createHttpAction = (t, action) => {
  const type = toGet(t, action);

  const fn = (body, params) => ({
    type,
    url: replace(action.url, params),
    path: parsePath(action.path, t),
    params,
    body: body && (action.body ? action.body(body) : body)
  });

  return [
    type,
    isPost(action) ? fn : params => fn(null, params)
  ];
};

export default l => {
  l = attachDefault(l);
  return fromPairs(reduce((p, c) => {
    const a1 = createAction(c, l[c]);
    return l[c].url
      ? [...p, createHttpAction(c, l[c]), a1]
      : [...p, a1];
  }, [], Object.keys(l)));
};

