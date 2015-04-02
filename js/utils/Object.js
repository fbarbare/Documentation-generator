define([
	'namespace',
	'NativeObjects'
], function (namespace, nativeObjects) {

	namespace.Object = nativeObjects.getNativeObject('Object');

	return namespace.Object;

});