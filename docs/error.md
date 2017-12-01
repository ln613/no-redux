### Handle http errors

If there are errors thrown during http calls (404, 500...), no-redux will put the error on the store under the 'error' property.

Everytime a new http request is made, the 'error' property will be set to null. You can also clear the 'error' property by calling:

```js
this.props.setError();
```
