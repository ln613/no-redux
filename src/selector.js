import { init, last, range } from 'ramda';

export default (...fns) => {
  if (fns.length === 0) return;

  const ps = init(fns);
  const f = last(fns);

  let args = null;
  let cache = null;

  return s => {
    const newArgs = ps.length === 0 ? [s] : ps.map(x => x(s));
    if (!args || range(0, args.length).some(i => args[i] !== newArgs[i])) {
      args = newArgs;
      cache = f.apply(null, args);
    }

    return cache;
  }
}