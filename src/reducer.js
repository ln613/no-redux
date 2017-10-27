import { last, lensPath, set, view, init } from 'ramda';
import { toSet } from './common';

export default l => {
  const keys = Object.keys(l);

  return (s = {}, a) => {
    if (keys.map(toSet).indexOf(a.type) === -1)
      return s;

    return set(lensPath(a.path), a.payload, s);
  };
}
