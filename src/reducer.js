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

    // if (a.error)
    //   return Object.assign({}, s, { error: a.error, isLoading: false });
    
    const path = is(Function, a.path)
      ? a.path(a.params, s, a.statusCode)
      : a.path;

    let state = Object.assign({}, s, {
      isLoading: false,
      error: a.error
    });
    
    const idx = last(path);
    if (is(Number, idx)) {
      const arr = init(path);

      if (isNil(a.payload)) // delete
        return over(lensPath(arr), remove(idx, 1), state);
      
      if (a.method === 'patch') {
        return reduce(
          (p, c) => set(lensPath(append(c, path)), a.payload[c], p),
          state,
          Object.keys(a.payload)
        );
      }

      if (idx === 0 && isNil(view(lensPath(arr), state)))
        state = set(lensPath(arr), [], state);
    }
    else if (idx instanceof Error) {
      state.error = {
        source: a.type,
        text: idx.message
      };
      return state;
    }

    return set(lensPath(path), a.payload, state);
  };
}
