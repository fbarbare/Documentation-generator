define([
	'namespace',
	'NativeObjects',
	'Object'
], function (namespace, nativeObjects, Object) {

	function getNativeFunction(functionToCall) {
		return function () {
			return functionToCall.apply(window.document, arguments);
		};
	}

	function init() {
		var key,
			newDocument,
			nativeDocument = nativeObjects.getNativeObject('document');

		newDocument = Object.create(window.document);

		for (key in newDocument) {
			if (typeof newDocument[key] === 'function') {
				if (nativeDocument[key]) {
					newDocument[key] = getNativeFunction(nativeDocument[key]);
				} else {
					delete newDocument[key];
				}
			}
		}

		return newDocument;
	}

	namespace.document = init();

	return namespace.document;

});