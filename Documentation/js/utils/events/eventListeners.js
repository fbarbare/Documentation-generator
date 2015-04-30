/*global define */
define([
    'elements/namespace',
    'Object',
    'Array',
    'Document',
    'Window'
], function(namespace, Object, Array, Document, Window) {
	'use strict';

    var events = new Array(),
        onEvent = null;

	namespace.eventListeners = new Object();

    function getNumberElement(element) {
    	var i;
        for (i = 0; i < events.length; i = i + 1) {
            if (events[i].element === element) {
                return i;
            }
        }
        return -1;
    }

    function runAllHandlers(elementObject, event) {
    	var i,
            handlers = elementObject.eventTypes[event.type];
    		length = handlers.length;
        for (i = 0; i < length; i = i + 1) {
        	if (typeof handlers[i] === 'function') {
            	handlers[i](event);
        	} else if (typeof handlers[i] === 'object' && typeof handlers[i].handleEvent === 'function') {
            	handlers[i].handleEvent(event);
        	}
        }
    }

    function addEventListener(element, eventType, handler) {
        var addEventFunc,
            attachEventFunc;
        switch (element) {
            case document:
                addEventFunc = Document.addEventListener;
                attachEventFunc = Document.attachEvent;
                break;
            case window:
                addEventFunc = Window.addEventListener;
                attachEventFunc = Window.attachEvent;
                break;
            default:
                addEventFunc = Element.prototype.addEventListener;
                attachEventFunc = Element.prototype.attachEvent;
        }

        if (addEventFunc) {
            addEventFunc.call(element, eventType, handler);
        } else if (attachEventFunc) {
            attachEventFunc.call(element, 'on' + eventType, handler);
        }
    }
    function removeEventListener(element, eventType, handler) {
        var removeEventFunc,
            detachEventFunc;
        switch (element) {
            case document:
                removeEventFunc = Document.removeEventListener;
                detachEventFunc = Document.detachEvent;
                break;
            case window:
                removeEventFunc = Window.removeEventListener;
                detachEventFunc = Window.detachEvent;
                break;
            default:
                removeEventFunc = Element.prototype.removeEventListener;
                detachEventFunc = Element.prototype.detachEvent;
        }

        if (removeEventFunc) {
            removeEventFunc.call(element, eventType, handler);
        } else if (detachEventFunc) {
            detachEventFunc.call(element, 'on' + eventType, handler);
        }
    }

    function addEvent(elementObject, element, eventType) {
        function onEvent(event, link) {
            if (!event.currentTarget) {
                event.currentTarget = element;
            }
			if (!event.target) {
                event.target = event.srcElement;
			}
            runAllHandlers(elementObject, event);
        }

        elementObject.handler = onEvent;
        addEventListener(element, eventType, onEvent);
    }

    function removeEvent(numberElement, element, eventType) {
        removeEventListener(element, eventType, events[numberElement].handler);
    }

    function addElementToEvents(element) {
    	var object = new Object();
    	object.element = element;
        object.eventTypes = new Object();
        object.handler = null;
        events.push(object);
    }

    function createEventForElement(elementObject, element, eventType, handler) {
        elementObject.eventTypes[eventType] = new Array(handler);
        addEvent(elementObject, element, eventType);
    }

    function addEventToArray(elementObject, eventType, handler) {
        var handlers = elementObject.eventTypes[eventType];
        if (handlers.indexOf(handler) === -1) {
            handlers.push(handler);
        }
    }

    function removeFunctionFromHandlers(elementObject, element, eventType, handler) {
        elementObject.eventTypes[eventType].removeElement(handler);
        
    }

    function deleteEvent(elementObject, numberElement, element, eventType) {
        removeEvent(elementObject, element, eventType);
        delete elementObject.eventTypes[eventType];
        if (elementObject.eventTypes.getLength() === 0) {
            events.removeIndex(numberElement);
        }
    }

	namespace.eventListeners.add = function(element, eventType, handler) {
        var numberElement = getNumberElement(element);

        if (numberElement !== -1 && events[numberElement].eventTypes[eventType]) {
            addEventToArray(events[numberElement], eventType, handler);
        } else if (numberElement !== -1) {
            createEventForElement(events[numberElement], element, eventType, handler);
        } else {
            addElementToEvents(element);
            numberElement = events.length - 1;
            createEventForElement(events[numberElement], element, eventType, handler);
        }
    };
    namespace.eventListeners.remove = function(element, eventType, handler) {
        var numberElement = getNumberElement(element);

        if (numberElement === -1) {
            return false;
        } else if (events[numberElement].eventTypes[eventType] && events[numberElement].eventTypes[eventType].length > 1) {
            removeFunctionFromHandlers(events[numberElement], element, eventType, handler);
        } else if (events[numberElement].eventTypes[eventType]) {
            deleteEvent(events[numberElement], numberElement, element, eventType, handler);
        }
    };

	return namespace.eventListeners;

});