define([
	'plugin/CSS/namespace',
	'Document',
	'Array',
	'display/CSS'
], function(namespace, doc, Array, CSS) {

	namespace.AddClassOnClick = function (dataAttribute, activeClass) {
		this.MENU_BUTTON_DATA_ATTR = dataAttribute;
		this.activeClass = activeClass || 'active';
	};

	namespace.AddClassOnClick.prototype.handleEvent = function (event) {
		var id = event.currentTarget.getAttribute(this.MENU_BUTTON_DATA_ATTR),
			menu = doc.getElementById(id);

		if (CSS.hasClassName(menu, this.activeClass)) {
			CSS.removeClassName(menu, this.activeClass);
		} else {
			CSS.addClassName(menu, this.activeClass);
		}
	};

	namespace.AddClassOnClick.prototype.init = function () {
		var i,
			elements = CSS.getElementsByDataAttribute(doc.body, this.MENU_BUTTON_DATA_ATTR);

		for (i = elements.length - 1; i >= 0; i--) {
			elements[i].addEventListener('click', this);
		}
	};

	return namespace.AddClassOnClick;
});