define([
	'namespace',
	'getNativeObject'
], function (namespace, getNativeObject) {

	namespace.Element = getNativeObject('Element');

	return namespace.Element;

});