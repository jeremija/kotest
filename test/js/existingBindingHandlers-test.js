define(['kotest', 'ko', 'jquery'], function(kotest, ko, $) {
	'use strict';

	var observable = ko.observable();

	kotest().binding('value', observable, '<input type="text">')
		.test('existingBindingHandlers-test.js', function(ctx) {
			it('should set value to input element', function() {
				var $el = $(ctx.element);
				observable('my value');
				expect($el.val()).to.be('my value');
			});
			it('should update value from input element', function() {
				var $el = $(ctx.element);
				$el.val('my other value').change();
				expect(observable()).to.be('my other value');
			});
		});

});