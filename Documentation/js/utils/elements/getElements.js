/*global define */
define([
    'elements/namespace',
    'getNativeObject',
    'Element',
    'Document',
    'Array'
], function(namespace, getNativeObject, Element, Document, Array) {
	'use strict';

	namespace.getElements = {};

	namespace.getElements.byId = function (key) {
		return Document.getElementById.call(document, key);
	};

	namespace.getElements.byTagName = function (parentElement, key) {
		return Element.prototype.getElementsByTagName.call(parentElement, key);
	};

	namespace.getElements.byDataAttribute = function (parentElement, key, value) {
		if (parentElement !== null) {
			var allChild = this.byTagName(parentElement, '*'),
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

	namespace.getElements.querySelector = function (parentElement, key) {
        if (parentElement === document) {
			return Document.querySelector.call(parentElement, key);
        } else {
			return Element.prototype.querySelector.call(parentElement, key);
        }
	};
	namespace.getElements.querySelectorAll = function (parentElement, key) {
        if (parentElement === document) {
			return Document.querySelectorAll.call(parentElement, key);
        } else {
			return Element.prototype.querySelectorAll.call(parentElement, key);
        }
	};
	
	return namespace.getElements;

});