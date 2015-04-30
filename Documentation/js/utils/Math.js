define([
	'namespace',
	'getNativeObject'
], function (namespace, getNativeObject) {

	namespace.Math = getNativeObject('Math');

	return namespace.Math;
});