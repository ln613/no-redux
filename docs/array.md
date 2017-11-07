### Locate an array element in the path

When locating an array element, you can:

* specify a zero-based index, like 'artists[2]', or
* specify a key/value pair, like 'artists[id=5]', no-redux will find the first object in the artists list with the id property equals to 5.

For string values, no quotes needed - 'artists[name=Michael Jackson]'.

It can be parameterized, like 'artists[id={id}]'. And if the name of the property is the same as the name of the parameter, it can be shortened as 'artists[id]'.

Sometimes it's useful to define different parameter names to avoid name conflict, 'artists[name={artistName}].albums[name={albumName}]'.

Let's look at an example. If you want to update the rate of an album in the store, first define an action object:

```js
rate: {
  path: 'artists[id].albums[name].rate',
},
```

Then call the setPath function with payload and params:

```js
this.props.setRate(88, { id: 5, name: 'Bad' });
```
