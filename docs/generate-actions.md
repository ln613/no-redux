### Generate action creators with generateActions

Assuming we have defined an action object named artist.

The generateActions function will generate a setArtist action creator, which will be used for setting the artist property on the redux store.

If the artist action has a url property (an http action), the generateActions function will generate one action creator for each http method you define with the method or methods property, e.g., getArtist, postArtist, putArtist, patchArtist and deleteArtist, which will be used for making http calls.

After the http response is received, the setArtist function will be called.

For get http actions, the http response will be put on the store.

For post, put or patch http actions, the body you send to the server will be put on the store, and the http response will be ignored.

For delete http actions, the object will be removed from the store.

The getArtist/deleteArtist function takes one parameter - 'params', which contains values for the parameters defined in the url or path properties.

The postArtist/putArtist/patchArtist function takes two parameters - 'body' and 'params'. 'body' is the object that will be posted to the server.

The setArtist function takes two parameters - 'payload' and 'params'. 'payload' is the value/object that will be put on the store.
