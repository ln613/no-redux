import { last, lensPath, set, view, over, init, is, isNil, remove, unnest, append, reduce } from 'ramda';
import { toHttpMethods, toSet, attachDefault } from './common';

export default l => {
  l = attachDefault(l);
  const keys = Object.keys(l);

  return (s = {}, a) => {
    if (unnest(keys.map(k => toHttpMethods(k, l[k])))
      .some(m => m[1].indexOf(a.type) > -1)
    )
      return Object.assign({}, s, { isLoading: true, error: null });
    
    if (keys.map(toSet).indexOf(a.type) === -1)
      return s;

    if (a.error)
      return Object.assign({}, s, { error: a.error, isLoading: false });
    
    const path = is(Function, a.path)
      ? a.path(a.params, s, a.statusCode)
      : a.path;
    
    const state = a.method // http response
      ? Object.assign({}, s, { isLoading: false })
      : s;
    
    if (is(Number, last(path))) {
      if (isNil(a.payload)) // delete
        return over(lensPath(init(path)), remove(last(path), 1), state);
      
      if (a.method === 'patch') {
        return reduce(
          (p, c) => set(lensPath(append(c, path)), a.payload[c], p),
          state,
          Object.keys(a.payload)
        );
      }
    }

    return set(lensPath(path), a.payload, state);
  };
}
