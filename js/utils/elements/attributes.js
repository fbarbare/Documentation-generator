/*global define */
define([
    'elements/namespace',
    'Object',
    'Element',
], function(namespace, Object, Element) {
	'use strict';

	namespace.attributes = new Object();

	namespace.attributes.has = function(element, key) {
		return Element.prototype.hasAttributes.call(element, key);
	};
	namespace.attributes.get = function(element, key) {
		return Element.prototype.getAttribute.call(element, key);
	};
	namespace.attributes.set = function(element, key, value) {
		return Element.prototype.setAttribute.call(element, key, value);
	};
	namespace.attributes.remove = function(element, key) {
		return Element.prototype.removeAttribute.call(element, key);
	};

	return namespace.attributes;

});