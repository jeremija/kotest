define(['kotest'], function(kotest) {
	'use strict';

	describe('kotest.defineComponent()', function() {
		it('should fail when name has no text or not a string', function() {
			expect(function() {
				kotest().defineComponent();
			}).to.throwError(/name must/);

			expect(function() {
				kotest().defineComponent('');
			}).to.throwError(/name must/);
		});
		it('should fail when config not an object', function() {
			expect(function() {
				kotest().defineComponent('test', undefined);
			}).to.throwError(/config must/);
		});
		it('should work when both name and config are defined', function() {
			kotest().defineComponent('name', {
				viewModel: function() {},
				template: ''
			});
		});
	});

	describe('kotest.defineBinding()', function() {
		it('should fail when name has no text or not a string', function() {
			expect(function() {
				kotest().defineBinding();
			}).to.throwError(/name must/);

			expect(function() {
				kotest().defineBinding('');
			}).to.throwError(/name must/);
		});
		it('should fail when handlers not an object', function() {
			expect(function() {
				kotest().defineBinding('test', undefined);
			}).to.throwError(/handlerObject must be defined/);
		});
		it('should work when both name and handlers are defined', function() {
			kotest().defineBinding('name', {
				init: function(element, valueAccessor) {

				},
				update: function(element, valueAccessor) {

				}
			});
		});
	});

	describe('kotest.component()', function() {
		it('should fail when no component name', function() {
			expect(function() {
				kotest().component();
			}).to.throwError(/name must/);
		});
	});

});