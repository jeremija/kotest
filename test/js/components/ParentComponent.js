define([], function() {
	'use strict';
	function Component1(params) {
		this.subcomponent1 = {
			name: 'child-component',
			params: {
				value: params.value1
			}
		};
		this.subcomponent2 = {
			name: 'child-component',
			params: {
				value: params.value2
			}
		};
	}

	return Component1;
});
