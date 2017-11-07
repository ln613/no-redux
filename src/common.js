import { last, reduce, is, isNil, view, lensPath, unnest, merge } from 'ramda';

const find = (a, p, v, c) => {
  const idx = a.findIndex(x => is(Object, x)
    ? (c ? x[p] == v : x[p] === v)
    : (c ? x == v : x === v)
  );
  
  if (idx === -1)
    throw new Error(`Item not found with '${p}=${v}'`);
  
  return idx;
}

const findWithParam = (a, p1, p2, params) => {
  const v = params && params[p2];
  
  if (isNil(v))
    return a.length;
  
  return find(a, p1, v);
}

const getIndex = (arr, prop, params) => {
  const ps = prop.split('=').map(x => x.trim());
  const propName = replace(ps[0], params);
  
  if (ps.length > 2) // [id=5=a]
    throw new Error(`Invalid path '${prop}'`);
  
  else if (ps.length > 1) {
    const pp = getParams(ps[1]);

    if (pp.length === 0) // [id=5], [{name}=a]
      return find(arr, propName, ps[1], true);

    else if (pp.length === 1 && ps[1] === `{${pp[0]}}`) // [id={ID}]
      return findWithParam(arr, propName, pp[0], params);

    else // [id={id}1], [id={id1}{id2}]
      return find(arr, propName, replace(ps[1], params), true);
  }

  else // [id]
    return findWithParam(arr, propName, propName, params);  
}

export const parsePath = (path, name) => {
  if (!path) return [name];

  const lens = path.split('.').map(x => {
    if (last(x) !== ']') return x;

    const m = x.match(/(.+)\[(.*)\]/);
    if (!m) return x;

    const [_, arrName, prop] = m;
    
    if (!arrName)
      throw new Error(`invalid path "${path}"`);
  
    return [arrName, prop];
  });

  return (params, state) => reduce((p, c) => {
    if (!is(Array, c)) return [...p, replace(c, params)];
    
    const arrName = replace(c[0], params);
    const prop = c[1];
    
    let arr = view(lensPath([...p, arrName]), state);
    let idx = null;

    if (!arr && prop === '')
      idx = 0;
    else if (!is(Array, arr))
      throw new Error(`${arrName} is not an array`);
    else if (prop === '')
      idx = arr.length;
    else if (!Number.isNaN(+prop))
      idx = +prop;
    else
      idx = getIndex(arr, prop, params);
    
    if (idx === -1)
      throw new Error(`Item not found with '${prop}'`);
    
    return [...p, arrName, idx];
  }, [], lens);
};  

export const attachDefault = merge({
  error: {},
  isLoading: {},
});

export const ofType = (a, as) =>
  as.filter(x => x.type === a.toString());

export const upper = x =>
  is(String, x) && x.length > 0
    ? x[0].toUpperCase() + x.slice(1)
    : '';

export const toGet = (x, a) =>
  (isPost(a) ? 'post' : 'get') + upper(x);

export const toSet = x =>
  'set' + upper(x);

export const isPost = x =>
  x && is(String, x.method) && x.method.toLowerCase() === 'post';

export const getParams = s =>
  (s.match(/{(.*?)}/g) || [])
    .map(x => x.match(/{(.*)}/)[1]);

export const replace = (s, params) => {
  if (params && is(Object, params)) {
    s = reduce(
      (p, c) => p.replace(new RegExp('\\{' + c + '\\}', 'g'), params[c]),
      s,
      Object.keys(params)
    );
  }

  const ps = getParams(s);

  if (ps.length > 0)
    throw new Error(`${ps.join(', ')} ${ps.length > 1 ? 'are' : 'is'} not provided`);
  
  return s;
}
