define([
	'namespace',
	'getNativeObject'
], function (namespace, getNativeObject) {

	namespace.Array = getNativeObject('Array');

	namespace.Array.prototype.removeElement = function (element) {
		var index = this.indexOf(element);
		this.splice(index, 1);
	};

	return namespace.Array;

});