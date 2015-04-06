/*global define */
define([
    'elements/namespace',
    'Object',
    'Array'
], function(namespace, Object, Array) {
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

    function runAllHandlers(numberElement, event) {
    	var i,
    		handlers = events[numberElement].eventTypes[event.type];
        for (i = 0; i < handlers.length; i = i + 1) {
        	if (typeof handlers[i] === 'function') {
            	handlers[i](event);
        	} else if (typeof handlers[i] === 'object' && typeof handlers[i].handleEvent === 'function') {
            	handlers[i].handleEvent(event);
        	}
        }
    }

    function addEvent(numberElement, element, eventType) {
        function onEvent(event, link) {
            if (!event.currentTarget) {
                event.currentTarget = element;
            }
			if (!event.target) {
                event.target = event.srcElement;
			}
			
            runAllHandlers(numberElement, event);
        }

        events[numberElement].handler = onEvent;

        if (element.addEventListener) {
            element.addEventListener(eventType, onEvent);

        } else if (element.attachEvent) {
            element.attachEvent('on' + eventType, onEvent);
        }
    }

    function removeEvent(numberElement, element, eventType) {

        if (element.removeEventListener) {
            element.removeEventListener(eventType, events[numberElement].handler);

        } else if (element.detachEvent) {
            element.detachEvent('on' + eventType, events[numberElement].handler);
        }
    }

    function addElementToEvents(element) {
    	var object = new Object();
    	object.element = element;
        object.eventTypes = new Object();
        object.handler = null;
        events.push(object);
    }

    function createEventForElement(numberElement, element, eventType, handler) {
        events[numberElement].eventTypes[eventType] = new Array();
        events[numberElement].eventTypes[eventType].push(handler);
        addEvent(numberElement, element, eventType);
    }

    function addEventToArray(numberElement, eventType, handler) {
        events[numberElement].eventTypes[eventType].push(handler);
    }

    function removeFunctionFromHandlers(numberElement, element, eventType, handler) {
        events[numberElement].eventTypes[eventType].removeElement(handler);
        
    }

    function deleteEvent(numberElement, element, eventType) {
        removeEvent(numberElement, element, eventType);
        delete events[numberElement].eventTypes[eventType];
        if (objectLength(events[numberElement].eventTypes) === 0) {
            delete events[numberElement];
        }
    }

	namespace.eventListeners.addEvent = function(element, eventType, handler) {
        var numberElement = getNumberElement(element);

        if (numberElement !== -1 && events[numberElement].eventTypes[eventType]) {
            addEventToArray(numberElement, eventType, handler);
        } else if (numberElement !== -1) {
            createEventForElement(numberElement, element, eventType, handler);
        } else {
            addElementToEvents(element);
            numberElement = events.length - 1;
            createEventForElement(numberElement, element, eventType, handler);
        }
    };
    namespace.eventListeners.removeEvent = function(element, eventType, handler) {
        var numberElement = getNumberElement(element);

        if (numberElement === -1) {
            return false;
        } else if (events[numberElement].eventTypes[eventType] && events[numberElement].eventTypes[eventType].length > 1) {
            removeFunctionFromHandlers(numberElement, element, eventType, handler);
        } else if (events[numberElement].eventTypes[eventType]) {
            deleteEvent(numberElement, element, eventType, handler);
        }
    };

    window.eventListeners = namespace.eventListeners;
	return namespace.eventListeners;

});