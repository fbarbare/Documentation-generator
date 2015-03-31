define([
	'namespace',
	'NativeObjects'
], function (namespace, nativeObjects) {

	namespace.Array = nativeObjects.getNativeObject('Array');

	return namespace.Array;

});