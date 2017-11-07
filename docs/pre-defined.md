### Pre-defined actions

#### Handle http errors

If there are errors thrown during http calls (404, 502...), no-redux will put the error on the store under the 'error' property.

Everytime a new http request is made, the 'error' property will be set to null. You can also clear the 'error' property by calling:

```js
this.props.setError();
```

#### isLoading flag

Everytime a new http request is made, the 'isLoading' property will be set to true. Everytime a http response is received (or a http error is thrown), the 'isLoading' property will be set to false. You can use this flag to show/hide your loading screen.

You can also clear the 'isLoading' property by calling:

```js
this.props.setIsLoading();
```
