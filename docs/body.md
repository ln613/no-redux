### Use the body function as a body creator

You can provide a function to generate the body for post/put/patch http actions if the body is complicated or has a lot of default values. This way, you don't have to provide the whole body everytime you call the action creator. For example,

```js
newArtist: {
  url: 'http://localhost/api/newartist',
  method: 'post',
  body: p => ({
    albums: [],
    rate: 50,
    ...p
  })
}
```

Then call it like:

```js
this.props.postNewArtist({
  id: 5,
  name: 'Michael Jackson',
  rate: 80
})
```