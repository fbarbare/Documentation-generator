define([
	'plugin/CSS/namespace',
	'Document',
	'Array',
	'elements/getElements',
	'elements/classNames',
	'elements/attributes',
	'events/eventListeners'
], function(namespace, doc, Array, getElements, classNames, attributes, eventListeners) {

	namespace.AddClassOnClick = function (dataAttribute, activeClass, keepActive) {
		this.dataAttribute = dataAttribute;
		this.activeClass = activeClass || 'active';
		this.keepActive = keepActive || false;
	};

	namespace.AddClassOnClick.prototype.handleEvent = function (event) {
		var modified = false,
			id = attributes.get(event.currentTarget, this.dataAttribute),
			menu = getElements.byId(id);

		if (classNames.has(menu, this.activeClass)) {
			if (!this.keepActive) {
				classNames.remove(menu, this.activeClass);
				modified = true;
			}
		} else {
			classNames.add(menu, this.activeClass);
			modified = true;
		}

		if (modified && typeof this.custom === 'function') {
			this.custom();
		}
	};

	namespace.AddClassOnClick.prototype.init = function () {
		var i,
			elements = getElements.byDataAttribute(doc.body, this.dataAttribute);

		for (i = elements.length - 1; i >= 0; i--) {
			eventListeners.add(elements[i], 'click', this);
		}
	};

	return namespace.AddClassOnClick;
});