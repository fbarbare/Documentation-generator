/*global define */
define([
    'elements/namespace',
    'Object',
    'Element',
], function(namespace, Object, Element) {
	'use strict';

	namespace.nodes = new Object();

	namespace.nodes.cloneNode = function(element, key) {
		return Element.prototype.cloneNode.call(element, key);
	};
	namespace.nodes.appendChild = function(parent, element) {
		return Element.prototype.appendChild.call(parent, element);
	};

	return namespace.nodes;

});