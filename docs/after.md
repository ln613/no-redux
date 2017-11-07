### Use the after property to specify a different payload

If the http response is not the payload you want to put on the store, you can provide a function to generate the payload based on the response and the body (if it's a post request).

For example, if the http response is:

```js
{ success: true, insertedAlbum: ... }
```

You can change the payload:

```js
after: response => response.insertedAlbum
```
