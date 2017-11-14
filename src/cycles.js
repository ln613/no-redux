import xs from 'xstream';
import { unnest, omit, tap } from 'ramda';
import { ofType, toHttpMethods, toSet, upper, hasBody } from './common';

export default l => unnest(
  Object.keys(l).map(x => {
    const types = toHttpMethods(x, l[x]);
    const typeSet = toSet(x);
    const actionObject = l[x];

    return [
      ...types.map(type =>
        s => ({
          HTTP: ofType(type[1], s.ACTION)
            .map(a => Object.assign(
              {},
              omit(['url', 'methods', 'type', 'after', 'path', 'body'], actionObject),
              {
                method: type[0],
                url: a.url,
                send: a.body,
                category: type[1],
                path: a.path,
                params: a.params
              }
            ))
        })
      ),
      
      ...types.map(type =>
        s => ({
          ACTION: s.HTTP
            .select(type[1])
            .map(r => r.replaceError(error => xs.of({
              type: typeSet,
              error: {
                source: type[1],
                text: error.response ? error.response.text : error.stack,
                status: error.response ? error.response.status : null,
              }
            })))
            .flatten()
            .map(r => r.error ? r : {
              type: typeSet,
              payload: getPayload(r, actionObject, type[0]),
              path: r.request.path,
              params: r.request.params,
              method: type[0],
              statusCode: r.statusCode
            })
        })
      )  
    ];
  })
)

const getPayload = (r, a, m) => {
  const { body, request } = r;
  const { params, send } = request;
  const after = '' + upper(m);

  if (a[after])
    return a[after](body, params, send);

  if (a.after)
    return a.after(body, params, send);
  
  if (m === 'delete')
    return null;
  
  return hasBody(m) ? send : body;
}