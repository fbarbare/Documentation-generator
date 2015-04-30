define([
	'namespace',
	'getNativeObject'
], function (namespace, getNativeObject) {

	namespace.RegExp = getNativeObject('RegExp');

	return namespace.RegExp;
});