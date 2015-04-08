/*global define */
define([
    'elements/namespace',
    'Object',
    'Array',
    'RegExp'
], function(namespace, Object, Array, RegExp) {
	'use strict';

	namespace.classNames = new Object();

function addClassName(element, value) {

}
function removeClassName(element, value) {

}

	namespace.classNames.has = function(element, value) {
		return new RegExp("(?:^|\\s+)" + value + "(?:\\s+|$)").test(element.className);
	};
	namespace.classNames.svgHas = function(element, value) {
    	return element.classList.contains(value);
	};
	namespace.classNames.get = function(element) {
		return element.className;
	};
	namespace.classNames.set = function(element, value) {
		element.className = value;
	};
	namespace.classNames.svgAdd = function(element, value) {
	    if (!this.svgHas(element, value)) {
	        element.classList.add(value);
	    }
	};
	namespace.classNames.add = function(element, value) {
		if (!this.has(element, value)) {
			element.className = element.className ? new Array(element.className, value).join(' ') : value;
		}
	};
	namespace.classNames.svgRemove = function(element, value) {
	    if (this.svgHas(element, value)) {
	        element.classList.remove(value);
	    }
	};
	namespace.classNames.remove = function(element, value) {
		if (this.has(element, value)) {
			var classNames = element.className.split(' '),
				index = classNames.indexOf(value);
			
			classNames.splice(index, 1);
			element.className = classNames.join(' ');
		}
	};

	return namespace.classNames;

});