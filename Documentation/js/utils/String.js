define([
	'namespace',
	'getNativeObject'
], function (namespace, getNativeObject) {

	namespace.String = getNativeObject('String');

	return namespace.String;
});