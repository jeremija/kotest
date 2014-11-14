define(['kotest', 'ko', 'jquery'], function(kotest, ko, $) {
	'use strict';

	var handlers = {
		init: function(element, value) {

		},
		update: function(element, valueAccessor) {
			element.innerHTML = ko.utils.unwrapObservable(valueAccessor());
		}
	};

	var observable = ko.observable();

	kotest().defineBinding('testBinding', handlers)
		.binding('testBinding', observable)
	.test('defineBinding-test.js', function(ctx) {

		it('should set binding handler to ko', function() {
			expect(ko.bindingHandlers.testBinding).to.be(handlers);
		});

		it('should update value', function() {
			observable('my test');
			var $el = $(ctx.element);
			expect($el.text()).to.be('my test');
		});

		after(function() {
			// should unregister test binding
			expect(ko.bindingHandlers.testBinding).to.not.be.ok();
		});

	});

});