define([
	'namespace',
	'getNativeObject'
], function (namespace, getNativeObject) {

	namespace.Array = getNativeObject('Array');

	namespace.Array.prototype.removeIndex = function (index) {
		this.splice(index, 1);
	};

	namespace.Array.prototype.removeElement = function (element) {
		var index = this.indexOf(element);
		this.splice(index, 1);
	};

	return namespace.Array;
});