### isLoading flag

Everytime a new http request is made, the 'isLoading' property will be set to true. Everytime a http response is received (or a http error is thrown), the 'isLoading' property will be set to false. You can use this flag to show/hide your loading screen.

You can also clear the 'isLoading' property by calling:

```js
this.props.setIsLoading();
```
