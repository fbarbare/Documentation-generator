/*global define */
define([
    'elements/namespace',
    'Object',
    'Array',
    'RegExp'
], function(namespace, Object, Array, RegExp) {
	'use strict';

	namespace.classNames = new Object();

	namespace.classNames.hasClassName = function(element, value) {
		return new RegExp("(?:^|\\s+)" + value + "(?:\\s+|$)").test(element.className);
	};
	namespace.classNames.getClassName = function(element) {
		return element.className;
	};
	namespace.classNames.setClassName = function(element, value) {
		element.className = value;
	};
	namespace.classNames.addClassName = function(element, value) {
		if (!this.hasClassName(element, value)) {
			element.className = element.className ? new Array(element.className, value).join(' ') : value;
		}
	};
	namespace.classNames.removeClassName = function(element, value) {
		if (this.hasClassName(element, value)) {
			var classNames = element.className.split(' '),
				index = classNames.indexOf(value);
			
			classNames.splice(index, 1);
			element.className = classNames.join(' ');
		}
	};

	return namespace.classNames;

});