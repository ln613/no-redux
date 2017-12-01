## Define action data

### Action object properties

When you define an action object, these are the available properties:

* [url](#url)
* [method](#method)
* [methods](#methods)
* [path](#update-nested-store-object-with-path)
* [after, afterGet, afterPost, afterPut, afterPatch, afterDelete](#use-the-after-property-to-specify-a-different-payload)
* [body](#use-the-body-property-as-a-body-creator-for-post)
* other http properties (headers, accept, user, password, attach..., please check [cyclejs http doc](https://cycle.js.org/api/http.html#api) for more info)

### The url property

If there is an url property, then it's an http action, otherwise it's a store action.

### The method property

The http method (get, post, put, patch, delete...). The default value is 'get'.

### The methods property

Define more than one method, in a string array, e.g., ['get', 'post']. If both methods and method are defined, the method will be ignored.
