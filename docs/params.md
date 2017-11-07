### Define parameters in the url or path property

You can define parameters in the url or path property:

```js
url: 'http://localhost/api/updateAlbumRate/{artist}/{album}/{rate}',
path: 'artist.album[id].rate'
```

Then you can call the action creator with the values of the parameters.

```js
this.props.getUpdateAlbumRate({
  artist: 'Michael Jackson',
  album: 'Bad',
  rate: 88,
  id: 5
})
```

The name 'getUpdateAlbumRate' may seem odd in this example since it's an update request. The 'get' prefix doesn't mean it's getting something from the server, it simply indicates that this is a http get request, not a http post.
