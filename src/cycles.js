import { unnest } from 'ramda';
import { parsePath, ofType, toGet, toSet } from './common';

export default l => unnest(
  Object.keys(l).map(x => {
    const typeGet = toGet(x);
    const typeSet = toSet(x);
    const t = l[x];
    const method = t.method ? t.method.toUpperCase() : 'GET';

    return [
      s => ({
        HTTP: ofType(typeGet, s.ACTION)
          .map(a => ({
            url: a.url,
            method,
            send: method === 'POST' ? (t.data ? t.data(a.payload) : a.payload) : null,
            category: typeGet,
            param: a.payload
          }))
      }),
      
      s => ({
        ACTION: s.HTTP
          .select(typeGet)
          .flatten()
          .map(r => ({
            type: typeSet,
            payload: t.post ? t.post(r.body, r.request.param) : r.body,
            path: parsePath(t.path, x)(r.request.param),
          }))
      })
    ];
  })
)