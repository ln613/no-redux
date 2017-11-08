### Generate action creators with generateActions

The 'generateActions' function will generate 2 action creators for each http action, one action creator for each store action.

#### get action creator

For each get http action, an action creator function with the name 'get + object name' will be created. For example, if you have an action object named 'artist', then an action creator function named 'getArtist' will be created.

The 'get' function will take one parameter - 'params' which contains values for the parameters defined in the url or path properties.

#### post action creator

For each post http action, an action creator function with the name 'post + object name' will be created. For example, if you have an action object named 'saveArtist', then an action creator function named 'postSaveArtist' will be created.

The 'post' function will take two parameters - 'body' and 'params', and 'body' will be the object that will be posted to the server.

#### set action creator

For both store actions and http actions, an action creator function with the name 'set + object name' will be created. For example, if you have an action object named 'artist', then an action creator function named 'setArtist' will be created.

The 'set' function will take two parameters - 'payload' and 'params', and 'payload' will be the value/object that will be put on the store.

For http actions, when you call the 'get/post' action creators, the http request will be made. And when the response is back, no-redux will call the corresponding 'set' action creator with the http response as the payload.
