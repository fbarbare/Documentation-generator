define([
	'plugin/CSS/namespace',
	'Document',
	'Array',
	'elements/getElements',
	'elements/classNames',
	'elements/attributes',
	'events/eventListeners'
], function(namespace, doc, Array, getElements, classNames, attributes, eventListeners) {

	namespace.AddClassOnClick = function (dataAttribute, activeClass) {
		this.dataAttribute = dataAttribute;
		this.activeClass = activeClass || 'active';
	};

	namespace.AddClassOnClick.prototype.handleEvent = function (event) {
		var id = attributes.get(event.currentTarget, this.dataAttribute),
			menu = getElements.byId(id);

		if (classNames.hasClassName(menu, this.activeClass)) {
			classNames.removeClassName(menu, this.activeClass);
		} else {
			classNames.addClassName(menu, this.activeClass);
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