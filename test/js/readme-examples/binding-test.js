define(['ko', 'kotest', 'jquery'], function(ko, kotest, $) {
    'use strict';

    var multiplier = {
        update: function(element, valueAccessor) {
            element.innerHTML = ko.utils.unwrapObservable(valueAccessor()) * 2;
        }
    };

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
});