define([
	'namespace'
], function (namespace) {

	function delegate(method, thisObject) {
		return function () {
			return method.apply(thisObject, arguments);
		};
	}

	namespace.cloneObject = function (sourceObject, thisObject, sourceFunctions) {
		var key,
			value,
			newObject;

		switch (typeof sourceObject) {
			case 'function':
				newObject = function() {};
				break;
			case 'object':
				newObject = {};
				break;
			default:
				throw new Error('object cannot be cloned');
				break;
		}

		thisObject = thisObject || sourceObject;
		sourceFunctions = sourceFunctions || sourceObject;
		
		if (Object.hasOwnProperty(sourceObject, 'prototype')) {
		    newObject.prototype = {};

		    for (key in sourceObject.prototype) {
		        if (typeof sourceObject.prototype[key] !== 'undefined') {
		            newObject.prototype[key] = sourceObject.prototype[key];
		        }
		    }
		}
		
		for (key in sourceObject) {
			if (typeof sourceObject[key] !== 'undefined') {
				value = sourceObject[key];
				
				// if (typeof value === 'function') {
				// 	if (sourceFunctions[key]) {
				// 		newObject[key] = delegate(sourceFunctions[key], thisObject);
				// 	} else {
				// 		newObject[key] = delegate(value, thisObject);
				// 	}
				// } else {
					newObject[key] = value;
				// }
			}
		}

		return newObject;
	}

	return namespace.cloneObject;

});