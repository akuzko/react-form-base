React Form Base
===============

Base Form component for building convenient forms for [React](https://facebook.github.io/react/).

[![build status](https://img.shields.io/travis/akuzko/react-form-base/master.svg?style=flat-square)](https://travis-ci.org/akuzko/react-form-base)
[![npm version](https://img.shields.io/npm/v/react-form-base.svg?style=flat-square)](https://www.npmjs.com/package/react-form-base)

## Features Overview

- Controlled Form, i.e. it accepts input values as a JSON object.
- Simple API that handles deeply nested values and collections.
- Flexible and convenient validation that allows to validate inputs as user types.
- Allows to easily turn any existing component into a Form Input component.

## Installation

```
npm install --save react-form-base
```

## Usage

### Input Prerequisites

`react-form-base` provides a `Form` base class which expects to work together
with **Input** components. An **Input** is any component that consumes three
properties: `value`, `error` and `onChange`. It also has to provide it's
`value` as first argument to `onChange` function supplied in props.
*For existing ready-for-use input bindings take a look on:*
- [react-form-js](https://github.com/akuzko/react-form-js)
- [react-form-material-ui](https://github.com/akuzko/react-form-material-ui)

### Form Usage

Most of form use-cases with examples are revealed in [**Demo Application**](https://akuzko.github.io/react-form-base/).
Details on how to run it locally are at the end of README.

#### Dedicated Forms

Most of forms developers deal with are quite complicated and encapsulate
vast amount of validation and rendering logic. After some basic setup described
in the [Wiki](https://github.com/akuzko/react-form-base/wiki) your form may
look like following (please note that `$render` is a helper method and it is
possible to use classic `render` method with a slightly more verbose result):

```js
class UserForm extends Form {
  validations = {
    'email': ['presence', 'email'],
    'fullName': 'presence',
    'address.city': 'presence',
    'address.line': { presence: true, format: /^[\w\s\d\.,]+$/ }
  };

  $render($) {
    return (
      <div>
        <TextField {...$('email')} label="Email" />
        <TextField {...$('fullName')} label="Full Name" />

        <Select {...$('address.countryId')} options={countryOptions} label="Country" />
        <TextField {...$('address.city')} label="City" />
        <TextField {...$('address.line')} label="Address" />

        <button onClick={this.save.bind(this)}>Submit</button>
      </div>
    );
  }
}
```

#### Inline Forms

If your form is small enough, you might want to render it inline instead of
defining separate form component. In this case you may pass renderer function
as only form's child. This function takes form's `$` function as argument for
convenience. Note that you still need to define static `validation` rules
for the Form to be able to use validations.

```js
<Form {...bindState(this)} validations={{ email: ['presence', 'email'], fullName: 'presence' }}>
  {$ => (
    <div>
      <TextField {...$('email')} label="Email" />
      <TextField {...$('fullName')} label="FullName" />
      <button onClick={this.registerUser}>Register</button>
    </div>
  )}
</Form>
```

#### API and helper methods

- `$(name)`, `input(name)` - returns a set of properties for input with a given
  name. `name` is a dot-separated string, i.e. `'foo.bar'` (for `bar` property
  nested in object under `foo`), or `'foos.1'` (value at index 1 of `foos` array),
  or `'foos.2.bar'` (`bar` property of object at index 2 of `foos` array)
- `get(name)` - returns a value for a given name. For example, if you have an
  attributes like `{foos: [{bar: 'baz'}, {bar: 'bak'}]}`, you might have:
  - `this.get('foos')       // => [{bar: 'baz'}, {bar: 'bak'}]`
  - `this.get('foos.1')     // => {bar: 'bak'}`
  - `this.get('foos.1.bar') // => 'bak'`
  - `this.get() // returns whole form's attributes object`
- `set(name, value)` - sets a `value` for an input with a specified `name`.
- `set(object)` - sets multiple values at once. Each key in the object
  corresponds to input name, and values are input values.
- `merge(name, value)` - merges given `value` object with value of input with
  a given `name`. Should be used when working with nested forms.
- `push(name, value)` - pushes a `value` to an input (which is treated as array)
  with a given `name`.
- `remove(name, index)` - removes an item of an input (which is treated as array)
  with a given `name` at index `index`.
- `each(name, iteratee)` - iterates with `iteratee` over items in an
  input with a given `name`, passing item and index to `iteratee`.
- `map(name, iteratee)` - maps with `iteratee` over items in an
  input with a given `name`, passing item and index to `iteratee`.
- `mapExtra(path, iteratee)` - maps with `iteratee` over items in an
  input with a given `name`, passing item and index to `iteratee`. Makes
  additional iteration that passes `null` and length of items to `iteratee`
- `getValidationErrors()` - returns validation errors.
- `performValidation()` - runs validation routines and sets errors.
- `ifValid(callback)` - runs validation routines, sets errors, and executes
  `callback` if there were no errors.
- `getErrors()` - returns an errors object.
- `getError(name)` - returns an error for an input with a given `name`.
- `setErrors(errors)` - sets `errors` (object) as form's errors.
- `save()` - if `this.props.validateOnSave` is `true` (which is default value),
  performs validation and calls `this.props.onRequestSave(this.get(), this);` if
  there were no errors. if `validateOnSave` property is `false`, calls
  `this.props.onRequestSave(this.get(), this);` immediately.
- `reset(attrs = {})` - calls `this.props.onChange(attrs)` and clears errors.

#### Form's props

| Prop Name             | Spec                                  | Description |
|-----------------------|---------------------------------------|-------------|
| `attrs`               | `PropTypes.object.isRequired`         | Form's attributes - the values of form's inputs |
| `onChange`            | `PropTypes.func`                      | A callback that is called whenever form's input changes it's value. Form's `attrs` are passed to it. Typically has a form of `(formAttrs) => this.setState({ formAttrs })` |
| `clearErrorsOnChange` | `PropTypes.bool`, defaults to `true`  | If input has an error on it and this property is enabled, error will be cleared when input changes its value |
| `validateOnChange`    | `PropTypes.bool`, defaults to `true`  | If form has input validations defined, and validation routines were called with unsuccessful result, enabling this property will re-validate input when its value changes |
| `validateOnSave`      | `PropTypes.bool`, defaults to `true`  | If `true`, on `save` method call form will run validations first and execute `onRequestSave` callback only if there were no errors |
| `onRequestSave`       | `PropTypes.func`                      | This callback is called in `Form#save` method, passing form's `attrs` and form object itself to it |
| `onValidationFailed`  | `PropTypes.func`                      | This callback is called if form's validation routines resulted in errors. Those `errors` and form object itself are passed to it |

### Form Container

`react-form-base`'s `Form` is a controlled form component, which means that
attributes it works with are supplied from outer component in `props`. This
also means that proper (yet trivial) `onChange` function should be also supplied.

```js
import React, { Component } from 'react';
import MyForm from 'my-form';

class Page extends Component {
  state = { item: {} };

  saveItem = (item, form) => {
    // stubbed AJAX request code (with axios-like error)
    post('/items', { item })
      .then(() => this.setState({ item: {} }))
      .catch((err) => form.setErrors(err.response.data));
  };

  render() {
    return (
      <MyForm
        attrs={this.state.item}
        onChange={(item) => this.setState({ item })}
        onRequestSave={this.saveItem}
      />
    );
  }
}
```

#### `bindState` helper function

`react-form-base` also ships `bindState(component, key = 'form')` helper function
that will generate `{ attrs, onChange }` props object for a given component.
For instance, form from example above using this helper will look like so:

```js
import React, { Component } from 'react';
import { bindState } from 'react-form-base';
import MyForm from 'my-form';

class Page extends Component {
  saveItem = (item, form) => {
    // ...
  };

  render() {
    return <MyForm {...bindState(this, 'item')} onRequestSave={this.saveItem} />;
  }
}
```

## Credits

Hugs and thanks to [ogrechishkina](https://github.com/ogrechishkina) for her
support and building all of the CSS for demo application.

## Running Demo locally

```
$ git clone git@github.com:akuzko/react-form-base.git
$ cd react-form-base
$ npm i
$ cd demo
$ npm i
$ gulp
```

## License

MIT
