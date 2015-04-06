define([
	'namespace',
	'getNativeObject'
], function (namespace, getNativeObject) {

	namespace.Number = getNativeObject('Number');

	return namespace.Number;

});