import xs from 'xstream';
import { unnest, omit, tap } from 'ramda';
import { ofType, toGet, toSet, isPost } from './common';

export default l => unnest(
  Object.keys(l).map(x => {
    const typeGet = toGet(x, l[x]);
    const typeSet = toSet(x);
    const t = l[x];
    const method = t.method ? t.method.toUpperCase() : 'GET';

    return [
      s => ({
        HTTP: ofType(typeGet, s.ACTION)
          .map(a => Object.assign(
            {},
            omit(['url', 'type', 'after', 'path', 'body'], t),
            {
              method,
              url: a.url,
              send: isPost(t) ? a.body : null,
              category: typeGet,
              path: a.path,
              params: a.params
            }
          ))
      }),
      
      s => ({
        ACTION: s.HTTP
          .select(typeGet)
          .map(r => r.replaceError(error => xs.of({
            type: typeSet,
            error: {
              source: typeGet,
              text: error.response ? error.response.text : error.stack,
              status: error.response ? error.response.status : null,
            }
          })))
          .flatten()
          .map(r => r.error ? r : {
            type: typeSet,
            payload: t.after
              ? t.after(r.body, r.request.params, r.request.send)
              : r.body,
            path: r.request.path,
            params: r.request.params,
            http: true
          })
      })
    ];
  })
)