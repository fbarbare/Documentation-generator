define([
	'namespace',
	'getNativeObject'
], function (namespace, getNativeObject) {

	namespace.Object = getNativeObject('Object');

	namespace.Object.prototype.getLength = function () {
		return Object.keys(this).length;
	};

	return namespace.Object;

});