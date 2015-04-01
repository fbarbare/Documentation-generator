/*global define */
define([
    'display/namespace',
    'Array'
], function(namespace, Array) {
	'use strict';

	namespace.CSS = {};

	namespace.CSS.getElementsByDataAttribute = function (parentElement, key, value) {
		if (parentElement !== null) {
			var allChild = parentElement.getElementsByTagName('*'),
				arrayElement = new Array(),
				i = 0;

			for(i = 0; i < allChild.length; i = i + 1){
				if(allChild[i].hasAttribute(key) && (value === undefined || allChild[i].getAttribute(key) === value)){
					arrayElement.push(allChild[i])
				}
			}
			return arrayElement.length > 0 ? arrayElement : null;
		}
	};

	namespace.CSS.hasClassName = function(element, value) {
		return new RegExp("(?:^|\\s+)" + value + "(?:\\s+|$)").test(element.className);
	};
	namespace.CSS.getClassName = function(element) {
		return element.className;
	};
	namespace.CSS.setClassName = function(element, value) {
		element.className = value;
	};
	namespace.CSS.addClassName = function(element, value) {
		if (!this.hasClassName(element, value)) {
			element.className = element.className ? [element.className, value].join(' ') : value;
		}
	};
	namespace.CSS.removeClassName = function(element, value) {
		if (this.hasClassName(element, value)) {
			var c = element.className;
			element.className = c.replace(new RegExp("(?:^|\\s+)" + value + "(?:\\s+|$)", "g"), " ");
		}
	};

	return namespace.CSS;

});