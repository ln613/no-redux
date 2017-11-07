import { last, lensPath, set, view, over, init, is, isNil, remove } from 'ramda';
import { toGet, toSet, attachDefault } from './common';

export default l => {
  l = attachDefault(l);
  const keys = Object.keys(l);

  return (s = {}, a) => {
    if (keys.map(k => toGet(k, l[k])).indexOf(a.type) > -1)
      return Object.assign({}, s, { isLoading: true, error: null });
    
    if (keys.map(toSet).indexOf(a.type) === -1)
      return s;

    if (a.error)
      return Object.assign({}, s, { error: a.error, isLoading: false });
    
    const path = is(Function, a.path)
      ? a.path(a.params, s)
      : a.path;
    
    const state = a.http
      ? Object.assign({}, s, { isLoading: false })
      : s;

    if (is(Number, last(path)) && isNil(a.payload))
      return over(lensPath(init(path)), remove(last(path), 1), state);
    else
      return set(lensPath(path), a.payload, state);
  };
}
