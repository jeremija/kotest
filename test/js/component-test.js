define(['ko', 'jquery', 'kotest', 'test/js/components/Component',
	'text!test/js/components/Component.htm'],
	function(ko, $, kotest, Component,
		componentTemplate)
{
	'use strict';

	var credentials;

	var params = {
		username: ko.observable(),
		password: ko.observable(),
		onSubmit: function(creds) {
			credentials = creds;
		},
		disposed: ko.observable()
	};

	kotest().defineComponent('login', {
		viewModel: Component,
		template: componentTemplate
	}).component('login', params).test('component-test.js', function(ctx) {

		it('should call onSubmit() cb with creds on click', function() {
			var $container = $(ctx.container);

			$container.find('input[name=username]')
				.val('john').change();
			$container.find('input[name=password]')
				.val('p455w0rd').change();

			$container.find('button').click();

			expect(credentials).to.eql({
				username: 'john',
				password: 'p455w0rd'
			});
		});

		after(function() {
			expect(params.disposed()).to.be(true);
		});
	});


});