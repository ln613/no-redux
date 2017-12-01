## Update nested store object with path

When it comes to updating a value in a deeply nested store object, keeping it immutable is a challenge. No-redux provides a way for you to define a path to locate the property or sub-object you want to update/insert/delete, and return a new state without modifying the old one.

If the path property is not provided, it will be the action object name, which means the payload will be put on the store under that name.
