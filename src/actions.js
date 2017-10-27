import { fromPairs, reduce, isNil } from 'ramda';
import { parsePath, toGet, toSet } from './common';

const createAction = (t, action) => {
  const type = toSet(t);
  return [
    type,
    payload => ({
      type,
      path: parsePath(action.path, t)(payload),
      payload: isNil(payload) ? null : payload
    })
  ];
};

const createHttpAction = (t, action) => {
  const type = toGet(t);
  const path = parsePath(action.path, t);
  const url = payload => payload
    ? reduce(
      (p, c) => p.replace(new RegExp('\\{' + c + '\\}', 'g'), payload[c]),
      action.url,
      Object.keys(payload)
    )
    : action.url;

  return [
    type,
    d => ({ type, url: url(d), path: path(d), payload: d })
  ];
};

export default l => fromPairs(
  reduce((p, c) => {
    const a1 = createAction(c, l[c]);
    return l[c].url
      ? [...p, createHttpAction(c, l[c]), a1]
      : [...p, a1];
  }, [], Object.keys(l))
);