### Define parameters in the url or path property

You can define parameters in the url or path property:

```js
album: {
  url: 'http://localhost/api/artist/{artistId}/album/{albumId}',
  method: ['put', 'patch', 'delete'],
  path: 'artist[id={artistId}].album[id={albumId}]'
}
```

Then you can call the action creator with the values of the parameters.

```js
this.props.patchAlbum(
  { rate: 80 },
  { artistId: 5, albumId: 3 }
)
```
