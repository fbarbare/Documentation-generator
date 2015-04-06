define([
	'namespace',
	'getNativeObject',
	'cloneObject',
	'Object'
], function (namespace, getNativeObject, cloneObject, Object) {

	namespace.window = cloneObject(window, window, getNativeObject('window'));

	return namespace.window;

});