define(['kotest', 'ko', 'jquery',
	'test/js/components/ParentComponent',
	'text!test/js/components/ParentComponent.htm',
	'test/js/components/ChildComponent',
	'text!test/js/components/ChildComponent.htm'],
	function(kotest, ko, $,
		ParentComponent,
		ParentComponentTemplate,
		ChildComponent,
		ChildComponentTemplate)
{
	'use strict';

	var params = {
		value1: ko.observable(),
		value2: ko.observable()
	};

	kotest().defineComponent('parent-component', {
		viewModel: ParentComponent,
		template: ParentComponentTemplate
	}).defineComponent('child-component', {
		viewModel: ChildComponent,
		template: ChildComponentTemplate
	}).component('parent-component', params)
	.test('nestedComponents-test.js', function(ctx) {

		it('should create two components', function() {
			var $el = $(ctx.element);
			expect($el.find('.c1').size()).to.be(1);
			expect($el.find('.c1 .c2').size()).to.be(2);
		});
		it('should bind view model to dom', function() {
			var $el = $(ctx.element);
			params.value1('text1');
			params.value2('text2');
			expect($el.find('.c1 .1st .c2').text()).to.be('text1');
			expect($el.find('.c1 .2nd .c2').text()).to.be('text2');
		});

	});


});