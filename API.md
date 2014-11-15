#kotest API documentation

Kotest module exports a single function, named `kotest`. Read below to see the
details.

- [kotest(testContainerId)](#kotesttestcontainerid)
- [kotest().defineComponent(name, config)](#kotestdefinecomponentname-config)
- [kotest().defineBinding(name, handlerObject)](#kotestdefinebindingname-handlerobject)
- [kotest().component(name, params, html)](#kotestcomponentname-params-html)
- [kotest().binding(name, value, html)](#kotestbindingname-value-html)
- [kotest()...test(name, callback)](#kotesttestname-callback)

## kotest(testContainerId)
Prepares a new instance to configure the test with.

### arguments
- `testContainerId` - defines the id of the HTMLElement the dynamically
generated test elements will be appended to. Can be omitted in which case it
defaults to `test`. This element should be present in your `test.html` document
body.

### return value
Returns a `testConfig` object which can be used to configure and run the tests.

## kotest().defineComponent(name, config)
Dynamically register a component to `knocokutjs`. This component will be
registered just before the tests begin, and will be unregistred after the tests.

The registration and unregistration is preformed by passing the arguments to
`ko.components.register()` and `ko.components.unregister()` functions.

Typically, you would use this function only when the component under test is
not registered to knockout. You can register multiple components.

### arguments
- `name` - the name of the component to register
- `config` - component configuration object

### return value
Returns a `testConfig` object which can be used to configure and run the tests.

### example
```javascript
kotest().defineComponent('my-component', {
    template: '<div data-bind="text: value"><div>',
    viewModel: function MyComponent(params) {
        this.value = params.value
    }
});
```

## kotest().defineBinding(name, handlerObject)
Similar to `kotest().defineComponent()`, this function dynamically registers a
binding handler with the specific name to knockout. It will fail when a binding
handler with the same name already exists in `ko.bindingHandlers` object.

This component will be registered juts before the tests begin, and unregistered
after the tests finish.

### arguments
- `name` - the name of the binding handler
- `handlerObject` - handler object with `init()` and/or `update()` methods.

### return value
Returns a `testConfig` object which can be used to configure and run the tests.

### example
```javascript
var handler = {
    init: function(element, valueAccessor/*, ... */) {
        // code
    },
    update: function(element, valueAccessor/*, ... */) {
        // code
    }
}
kotest().defineBinding('myBinding', handler)
```

## kotest().component(name, params, html)
Prepares the test configuration to test a component. As the components are
loaded asynchronously, it a `setTimeout()` is called and the rest of the
code will be executed after that call finishes.

### arguments
- `name` - name of the component to test
- `params` - parameters to set to the component
- `html` - `optional` argument to describe the html element to use. Default is
`<div></div>`. For example, if you wanted to initiate your component on a `form`
element, you would use `<form></form>`.

### return value
Returns `testStarter` object with the `test()` function to define tests with.
This is described below.

### example
```javascript
var params = {
    value: ko.observable()
};

kotest().component('my-component', params)
```

## kotest().binding(name, value, html)

Prepares the test configuration to test a binding handler.

### arguments
- `name` - name of the binding handler to test
- `value` - a value/object/observable to set the binding handler's value to
- `html` - `optional` argument to describe the html element to use. Default is
`<div></div>`. For example, if you wanted to test an input element, you would
set it to `<input>`, as input tags do not need to be closed.

### return value
Returns `testStarter` object with the `test()` function to define tests with.
This is described below.

### example
```javascript
var value = ko.observable();

kotest().binding('customInputBinding', value, '<input type="text">');
```

## kotest().bindings(html)

Preparees the test configuration to test multiple binding handlers on the
same element.

### arguments
- `html` - optional, acts the same as in `kotest().binding()` function.

### return value
Returns a `testStarter` object with the `add()` and `test()` methods.

You must define at least one binding with the `add()` function. If a single
binding is defined, it will act exactly as `kotest().binding()`.

## kotest().bindings().add(name, value)

Adds a `value` to the specific binding defined by `name`.

### arguments
- `name` - name of the binding to set to the element under test
- `value` - a value/object/observable to set the value of the binding handler
to.

### return value
Returns the same `testStarter` object with `test()` and `add()` methods.

### example
```javascript
var additive = {
    update: function(element, valueAccessor, allBindings, vm, ctx) {
        var value = parseInt(ko.utils.unwrapObservable(valueAccessor()));
        var param = 0;
        if (allBindings.has('additiveParam')) {
            param = allBindings.get('additiveParam');
            param = parseInt(ko.utils.unwrapObservable(param));
        }
        element.innerHTML = value + param;
    }
};

var a = ko.observable(5),
    b = ko.observable(10);

kotest().defineBinding('additive', additive)
    .bindings().add('additive', a).add('additiveParam', b)
    .test('multipleBindings-test.js', function(ctx) {
        it('should set element\'s value to a + b', function() {
            expect(ctx.element.innerHTML).to.eql(15);
        });
        it('should update as soon as a value changes', function() {
            b(11);
            expect(ctx.element.innerHTML).to.eql(16);
        });
    });
```

## kotest()...test(name, callback)

### arguments
- `name` - name of the test
- `callback` - callback to call when the test is set up. It accepts a single
argument `ctx` which holds the test context. The test context object holds
two properties:
- `element` - the element which has the specific binding/component applited to
- `container` - element's container, same as `element.parentNode`.

### return value
This element does not return anything

### example
Examples are available in [README](README.md);
