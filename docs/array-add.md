### Add element to an array

If you leave the array element locator empty, it means you want to add a new element to the array:

```js
album: {
  path: 'artists[id].albums[]',
}
...
this.props.setAlbum({ name: "Off the Wall", year: 1979 }, { id: 5 })
```

You can also specify the locator, but do not provide a value for the parameter, it also means you want to insert the element to the array.

```js
album: {
  path: 'artists[id].albums[name]',
}
...
this.props.setAlbum({ name: "Off the Wall", year: 1979 }, { id: 5 })
```
