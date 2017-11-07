### Save the changes to the server and update the state

Add a url to the above action object, then you can save the changes to the server and update the state at the same time.

```js
newAlbum: {
  url: 'http://localhost/api/addAlbum/{id}',
  method: 'post',
  path: 'artists[id].albums[]',
}
...
this.props.postNewAlbum({ name: 'Off the Wall', year: '1979' }, { id: 5 })
```

This works when the http response is the same as the payload. If the service api is designed differently, you can use the after property to define the payload.

```js
newAlbum: {
  url: 'http://localhost/api/addAlbum',
  method: 'post',
  path: 'artists[id].albums[]',
  after: response => response.newAlbum
}
...
this.props.postNewAlbum({
  artistId: 5,
  newAlbum: { name: 'Off the Wall', year: '1979' }
 }, { id: 5 })
```

Or if the server doesn't return the original body you are posting, you can still access it from the body parameter.

```js
after: (response, body) => body.newAlbum
```
