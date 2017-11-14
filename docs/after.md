### Use the after property to specify a different payload

If you want to change the default behavior on what is going to be put on the store after the http response is received, you can provide an 'after' function to generate the payload based on the response and the body you send to the server, which are the two parameters to the after function.

For example, if the http response is:

```js
{ success: true, insertedAlbum: ... }
```

You can change the payload:

```js
after: response => response.insertedAlbum
```

There are 5 functions for each http method - afterGet, afterPost, afterPut, afterPatch, afterDelete, and there is also a generic version - after, which applies to all http actions.

If you specify both the specific and the generic versions, the generic version will be ignored for that specific http method.

For example, if you specify afterPost and after, then for the post action, afterPost will be called, and for the get action, the after will be called.