define(['ko', 'kotest', 'jquery'], function(ko, kotest, $) {
    'use strict';

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

});