import xs from 'xstream';
import { unnest, omit } from 'ramda';
import { ofType, toHttpMethods, toSet, upper, hasBody, tap } from './common';

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
            .map(r => r.replaceError(error => xs.of(Object.assign(
              createSetAction(typeSet, type[0], actionObject, error.response),
              {
                error: {
                  source: type[1],
                  text: error.response && error.response.error && error.response.error.message,
                  status: error.response && error.response.status,
                }
              }
            ))))
            .flatten()
            .map(r => r.error
              ? r
              : createSetAction(typeSet, type[0], actionObject, r)
            )
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

  if (m === 'post' && send && !send.id && body && body.id)
    return Object.assign({}, send, { id: body.id });
  
  return hasBody(m) ? send : body;
}

const createSetAction = (type, method, actionObject, response) => ({
  type,
  method,
  payload: getPayload(response, actionObject, method),
  path: response.request.path,
  params: response.request.params,
  statusCode: response.statusCode
})