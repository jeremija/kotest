(function(context, name, definition) {
    'use strict';
    if (typeof define === 'function' && typeof define.amd === 'object') {
        define(['ko'], definition);
        return;
    }
    context[name] = definition(context.ko);
}(this, 'kotest', function(ko) {
    'use strict';

    function registerComponent(definition) {
        ko.components.register(definition.name, definition.config);
    }

    function unregisterComponent(definition) {
        ko.components.unregister(definition.name);
    }

    function registerBindingHandler(definition) {
        var name = definition.name;
        if (name in ko.bindingHandlers) {
            throw new Error('binding handler "' + name + '" already defined');
        }
        ko.bindingHandlers[definition.name] = definition.handlerObject;
    }

    function unregisterBindingHandler(definition) {
        delete ko.bindingHandlers[definition.name];
    }

    function html2el(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        return div.firstChild;
    }

    var testConfigFactory = {
        component: function(testConfigParams, element) {
            element.setAttribute('data-bind', 'component: value');
            return {
                element: element,
                value: testConfigParams,
                async: true
            };
        },
        binding: function(testConfigParams, element) {
            element.setAttribute('data-bind', testConfigParams.name + ': value');
            return {
                element: element,
                value: testConfigParams.value,
                async: false
            };
        }
    };

    function getTestConfig(testConfig) {
        var factory = testConfigFactory[testConfig.type];
        if (!factory) throw new Error('unknown test type: ' + testConfig.type);
        var html = testConfig.html || '<div></div>';
        return factory(testConfig.params, html2el(html));
    }

    /**
     * Registered dependent components, create a container layout for testing
     * and updates the dependencies.
     * @param  {String} id              id of the element to append to, default
     * is 'test'
     * @param  {String} testName        name of the current test
     * @param  {Object} componentParams params for the knockout component
     * @param  {String} componentParams.name
     * @param  {Object} componentParams.params
     * @param  {Array} dependencies     array of dependent component definitions
     * which will be registered before test and unregistered after
     * @param  {Function} tests         callback to run when component is loaded
     * @private
     */
    function startTest(id, testName, testConfig, dependencies, tests) {
        describe('kotest.js: ' + testName, function() {
            var container, vm, context = {}, async;
            var config = getTestConfig(testConfig);
            async = config.async;
            before(function() {
                var element = config.element;
                dependencies.components.forEach(registerComponent);
                dependencies.bindingHandlers.forEach(registerBindingHandler);
                vm = {
                    value: config.value
                };
                container = document.createElement('div');
                container.appendChild(element);
                document.getElementById(id || 'test').appendChild(container);
                ko.applyBindings(vm, container);
                context.element = element;
                context.container = container;
            });

            after(function() {
                ko.cleanNode(container);
                dependencies.components.forEach(unregisterComponent);
                dependencies.bindingHandlers.forEach(unregisterBindingHandler);
                container.parentNode.removeChild(container);
                delete context.element;
                delete context.container;
            });

            if (async) {
                it('wait for the component to load', function(done) {
                    setTimeout(function() {
                        // this needs to be async as knockout components are loaded
                        // asynchronously
                        done();
                    });
                });
            }


            if (tests) tests(context);
        });
    }

    function assertHasText(string, msg) {
        if (typeof string !== 'string') {
            throw new TypeError(msg || 'Expected value to be a string');
        }
        if (!string.length) {
            throw new TypeError(msg || 'Expected a non-empty string');
        }
    }

    function assertIsObject(object, msg) {
        if (!object || typeof object !== 'object') {
            throw new TypeError(msg || 'Expected an object');
        }
    }

    /**
     * @exports
     * @return {Object} test configuration object
     */
    function kotest(testContainerId) {
        var dependencies = {
            components: [],
            bindingHandlers: []
        };
        var id = testContainerId;
        return {
            /**
             * Define a component which will be automatically registered
             * and unregistered from knockout before and after test.
             */
            defineComponent: function(name, config) {
                assertHasText(name, 'Component name must be defined');
                assertIsObject(config, 'Component config must be defined');
                dependencies.components.push({
                    name: name,
                    config: config
                });
                return this;
            },
            defineBinding: function(name, handlerObject) {
                assertHasText(name, 'Binding name must be defined');
                assertIsObject(handlerObject, 'handlerObject must be defined');
                dependencies.bindingHandlers.push({
                    name: name,
                    handlerObject: handlerObject
                });
                return this;
            },
            /**
             * Prepares a test for testing a knockout component
             */
            component: function(name, params, html) {
                assertHasText(name, 'Component name must be a string');
                var testConfig = {
                    type: 'component',
                    html: html,
                    params: {
                        name: name,
                        params: params
                    }
                };
                return {
                    test: function(name, callback) {
                        startTest(id, name, testConfig, dependencies, callback);
                    }
                };
            },
            /**
             * Perpares a test for testing a knockout binding handler
             */
            binding: function(name, value, html) {
                assertHasText(name, 'binding name must be defined');
                var testConfig = {
                    type: 'binding',
                    html: html,
                    params: {
                        name: name,
                        value: value,
                    }
                };
                return {
                    test: function(name, callback) {
                        startTest(id, name, testConfig, dependencies, callback);
                    }
                };
            }
        };
    }

    return kotest;

}));