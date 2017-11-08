### Remove element from an array

If you update the array element with 'null', that element will be removed from the array.

```js
album: {
  path: 'artists[id].albums[name]',
}
...
this.props.setAlbum(null, { id: 5, name: 'Bad' })
```

As you can see, you can define just one action object to achieve all update/insert/delete functionalities, or you can define an action object for each functionality.
