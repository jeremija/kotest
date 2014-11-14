define(['ko', 'kotest', 'jquery'], function(ko, kotest, $) {
    'use strict';

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

    var template =
        '<form data-bind="submit: submit">' +
            '<input name="user" type="text" data-bind="value: username">' +
            '<input name="pass" type="text" data-bind="value: password">' +
            '<input type="submit">' +
        '</form>';

    var credentials;

    var params = {
        onSubmit: function(creds) {
            credentials = creds;
        }
    };

    kotest().defineComponent('login-component', {
        viewModel: LoginComponent,
        template: template
    }).component('login-component', params)
    .test('readme-examples/component-test.js', function(ctx) {
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

});