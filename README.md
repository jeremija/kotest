# kotest

Test Knockout 3.2 components and custom binding handlers with ease.

# Dependencies

- [KnockoutJS](http://knockoutjs.com)
- [Mocha](http://mochajs.org)

This library supports loading via AMD or as a global object, but mocha always
needs to in the global scope. Knockout's alias should be set to `ko`.

In the examples below and in unit tests [expect.js](https://github.com/LearnBoost/expect.js/) and [jQuery](http://jquery.com) are used for brevity.

#Usage

## Testing Components

Assume you have a component defined:

```javascript
function LoginComponent(params) {
    this.username = ko.observable();
    this.password = ko.observable();
    this.onSubmit = params.onSubmit;
}
LoginComponent.prototype.submit = function() {
    this.onSubmit({
        username: this.username(),
        password: this.password()
    });
};
```
And the `template` variable containing:
```html
<form data-bind="submit: onSubmit">
    <input name="user" type="text" data-bind="value: username">
    <input name="pass" type="text" data-bind="value: password">
    <input type="submit">
</form>
```

And you wish to test if it works correctly:
```javascript
var credentials;

var params = {
    onSubmit: function(creds) {
        credentials = creds;
    }
};

kotest().defineComponent('login-component', {
    viewModel: LoginComponent,
    template: template
}).component('login-component', params).test('my first test', function(ctx) {
    before(function() {
        var $element = $(ctx.element);
        $element.find('input[name=user]').val('john').change();
        $element.find('input[name=pass]').val('p455w0rd').change();
        $element.find('form').submit();
    });
    it('should have called params.onSubmit() with credentials', function() {
        expect(credentials).to.eql({
            username: 'john',
            password: 'p455w0rd'
        });
    });
});
```
Note that you can define multiple components with `defineComponent()`. This is
useful if you want to test a component which depends on other components. If
all of your components are already loaded, you can omit the `defineComponent()`
call.

The `kotest()` function accepts an argument. It is the id of the test element
in the dom to append the dynamically created elements for the test to. The
default value of this argument is 'test', so you should an empty (div) element
defined in your main test html file.

## Testing Binding Handlers
Let's say you have a custom binding handler:
```javascript
var multiplier = {
    update: function(element, valueAccessor) {
        element.innerHTML = ko.utils.unwrapObservable(valueAccessor()) * 2;
    }
};
```
To test it's functionality, type:
```javascript
var value = ko.observable(5);

kotest().defineBinding('multiplier', multiplier)
    .binding('multiplier', value).test('multiplier test', function(ctx) {
        it('should make the value double', function() {
            expect($(ctx.element).text()).to.eql(10);
        });
        it('should make the value double again', function() {
            value(10);
            expect($(ctx.element).text()).to.eql(20);
        });
    });
```
As with the previous example, you can omit the `defineBinding()` call if your
custom binding handler is already set in `ko.bindingHandlers`.

For more information clone the repository and view the tests inside the
[test/js/](test/js) folder. The examples from this file can be found in the
[test/js/readme-examples/](test/js/readme-examples) folder. All tests can be run with `npm test`. See
section `Cloning and running tests` below for more details.

# API Reference
Available [here](API.md).

# Installing

```bash
bower install kotest
```

# Cloning and running tests

```bash
git clone https://github.com/jeremija/kotest.git
npm test
```

This will also install all depenencies required for testing from the command line. You can also run these tests in browser. You will need to run HTTP server like `http-server` from the project's root directory:

```
npm install -g http-server
http-server
```

And then visit the [http://localhost:8080/test/test.html](http://localhost:8080/test/test.html) page in your browser. Note that `npm test` should be performed at least once beforehand because it also downloads and installs all of the necessary dependencies and writes the configuration for tests.

# License

MIT
