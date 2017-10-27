import { last, reduce } from 'ramda';

export const parsePath = (path, name) => d => {
  if (!path) return [name];

  return reduce((p, c) => {
    if (last(c) !== ']') return [...p, c];

    const m = c.match(/(.+)\[(.+)\]/);
    if (!m) return p;
    
    let m2 = +m[2];
    if (isNaN(m2)) m2 = d[m[2]];
    if (!m2 || isNaN(+m2)) m2 = 0;

    return [...p, m[1], +m2];

  }, [], path.split('.'));
}  

export const ofType = (a, as) => as.filter(x => x.type === a.toString());

export const upper = x => x[0].toUpperCase() + x.slice(1);

export const toGet = x => 'get' + upper(x);

export const toSet = x => 'set' + upper(x);
