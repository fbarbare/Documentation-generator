define([
	'namespace',
	'getNativeObject'
], function (namespace, getNativeObject) {

	namespace.Object = getNativeObject('Object');

	return namespace.Object;

});