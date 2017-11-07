## Define action data

### Action object properties

When you define an action object, these are the available properties:

* [url](#store-action-vs-http-action)
* [method](#get-http-action-vs-post-http-action)
* [path](#update-nested-store-object-with-path)
* [after](#use-the-after-property-to-specify-a-different-payload)
* [body](#use-the-body-property-as-a-body-creator-for-post)
* other http properties (headers, accept, user, password, attach..., please check [cyclejs http doc](https://cycle.js.org/api/http.html) for more info)

### Store action vs http action

If there is an url property, then it's a http action, otherwise it's a store action.

### Get http action vs post http action

If the method property is 'post', it's a post http action, otherwise it's a get http action.

#include "docs/generate-actions.md"
#include "docs/after.md"
#include "docs/params.md"
#include "docs/body.md"
#include "docs/pre-defined.md"