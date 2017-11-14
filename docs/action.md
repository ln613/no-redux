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

### Url

If there is an url property, then it's a http action, otherwise it's a store action.

### Method

The http method (get, post, put, patch, delete...). If method is not defined, it's a get.

### Methods

Define more than one method, in a string array, e.g., ['get', 'post'].

#include "docs/generate-actions.md"
#include "docs/after.md"
#include "docs/params.md"
#include "docs/body.md"
#include "docs/pre-defined.md"