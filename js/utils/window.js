define([
	'namespace',
	'getNativeObject',
	'cloneObject',
	'Object'
], function (namespace, getNativeObject, cloneObject, Object) {

	namespace.Window = cloneObject(window, window, getNativeObject('window'));

	return namespace.Window;

});