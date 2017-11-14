import { toHttpMethods, toSet, replace, getParams, parsePath } from '../src/common';

test('toHttpMethods', () => {
  expect(toHttpMethods('list')).toEqual([['get', 'getList']]);
  expect(toHttpMethods('artist', { method: 'post' })).toEqual([['post', 'postArtist']]);
  expect(toHttpMethods('artist', { method: 'PUT' })).toEqual([['put', 'putArtist']]);
  expect(toHttpMethods('artist', { methods: ['GET', 'POST', 'put', 'delete'] }))
    .toEqual([['get', 'getArtist'], ['post', 'postArtist'], ['put', 'putArtist'], ['delete', 'deleteArtist']]);
  expect(() => toHttpMethods('artist', { method: {} })).toThrow(`'method' property must be a string`);
  expect(() => toHttpMethods('artist', { methods: {} })).toThrow(`'methods' property must be a list of strings`);
  expect(() => toHttpMethods('artist', { methods: ['get', true] })).toThrow(`'methods' property must be a list of strings`);
});

test('toSet', () => {
  expect(toSet('list')).toBe('setList');
});

test('replace', () => {
  expect(replace('aa/{p1}/c{p2}', { p1: 'bb', p2: 'c' })).toBe('aa/bb/cc');
  expect(() => replace('aa/{p1}/c{p2}')).toThrow('p1, p2 are not provided');
  expect(() => replace('aa/{p1}/c{p2}', { p1: 'bb' })).toThrow('p2 is not provided');
  expect(replace('{p1}', { p1: 'bb' })).toBe('bb');
  expect(replace('{p', { p1: 'bb' })).toBe('{p');
});

test('getParams', () => {
  expect(getParams('artists[id].{f3}[n].{f2}')).toEqual(['f3', 'f2']);
  expect(getParams('artists[id]')).toEqual([]);
});

test('parsePath - object path', () => {
  expect(parsePath(null, 'abc')).toEqual(['abc']);
  expect(parsePath('p1.p2')()).toEqual(['p1', 'p2']);
  expect(parsePath('p1.{p}.p3')({ p: 'p2' })).toEqual(['p1', 'p2', 'p3']);
});

const params = {
  f1: 'albums',
  f2: 'year',
  f3: 'name',
  f4: 'year',
  id: 5,
  name: 'a3',
  year: 1998,
  artistName: 'A2',
  albumName: 'a4',
};

const state = {
  artists: [
    {
      id: 3,
      name: 'A1',
      albums: [
        { id: 1, name: 'a1', year: 1990 },
        { id: 2, name: 'a2', year: 1995 },
      ]
    },
    {
      id: 5,
      name: 'A2',
      albums: [
        { id: 3, name: 'a3', year: 1992 },
        { id: 4, name: 'a4', year: 1998 },
      ]
    }
  ]
};

test('parsePath - array path', () => {
  expect(parsePath('artists[id].{f1}[name].{f2}')(params, state)).toEqual(['artists', 1, 'albums', 0, 'year']);
  expect(parsePath('artists[id].{f1}[{f3}].{f2}')(params, state)).toEqual(['artists', 1, 'albums', 0, 'year']);
  expect(parsePath('artists[id].{f1}[{f4}].{f2}')(params, state)).toEqual(['artists', 1, 'albums', 1, 'year']);
  expect(parsePath('artists[id=3].albums[name=a2].year')(params, state)).toEqual(['artists', 0, 'albums', 1, 'year']);
  expect(parsePath('artists[id].albums[n].year')(params, state)).toEqual(['artists', 1, 'albums', 2, 'year']);
  expect(parsePath('artists[id=5].albums[{f4}={year}].year')(params, state)).toEqual(['artists', 1, 'albums', 1, 'year']);
  expect(parsePath('artists[id={id}].albums[name={name}].year')(params, state)).toEqual(['artists', 1, 'albums', 0, 'year']);
  expect(parsePath('artists[name={artistName}].albums[name={albumName}].year')(params, state)).toEqual(['artists', 1, 'albums', 1, 'year']);
});
  
test('parsePath - array path - error', () => {
  expect(() => parsePath('artists[id].{f5}[name].year')(params, state)).toThrow('f5 is not provided');
  expect(() => parsePath('artists[id].{f3}[name].year')(params, state)).toThrow('name is not an array');
  expect(() => parsePath('artists[id].albums[name=a5].year')(params, state)).toThrow("Item not found with 'name=a5'");
  expect(() => parsePath('artists[id].albums[name={name}1].year')(params, state)).toThrow("Item not found with 'name=a31'");
  expect(() => parsePath('artists[id].albums[name={name}{id}].year')(params, state)).toThrow("Item not found with 'name=a35'");
  expect(() => parsePath('artists[id].albums[name=a5={id}].year')(params, state)).toThrow("Invalid path 'name=a5={id}'");
});
