import { last, is, unnest, takeLast, dropLast } from 'ramda';
import { update } from 'ipath';
import { toHttpMethods, toSet, attachDefault, tap } from './common';

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
    
    let path = a.path;

    if (path.length > 0 && a.method === 'post') { // restful post to array
      if (takeLast(4, path) === '[id]')
        path = dropLast(4, path) + '[]';
      else if (takeLast(2, path) !== '[]')
        path += '[]';
    }

    let state = Object.assign({}, s, {
      isLoading: false,
      lastAction: a.type,
      error: a.error
    });

    return update(state, tap(path), a.payload, a.params || a.payload, a.method === 'patch');

    // const idx = last(path);
    // if (is(Number, idx)) {
    //   const arr = init(path);

    //   if (isNil(a.payload)) // delete
    //     return over(lensPath(arr), remove(idx, 1), state);
      
    //   if (a.method === 'patch') {
    //     return reduce(
    //       (p, c) => set(lensPath(append(c, path)), a.payload[c], p),
    //       state,
    //       Object.keys(a.payload)
    //     );
    //   }

    //   if (idx === 0 && isNil(view(lensPath(arr), state)))
    //     state = set(lensPath(arr), [], state);
    // }
    // else if (idx instanceof Error) {
    //   state.error = {
    //     source: a.type,
    //     text: idx.message
    //   };
    //   return state;
    // }

    // return set(lensPath(path), a.payload, state);
  };
}
