define([
	'namespace',
	'getNativeObject',
	'cloneObject',
	'Object'
], function (namespace, getNativeObject, cloneObject, Object) {

	namespace.document = cloneObject(document, document, getNativeObject('document'));

	window.newDocument = namespace.document;
	return namespace.document;

});