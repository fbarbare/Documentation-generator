define([
	'plugin/CSS/namespace',
	'Array',
	'display/CSS'
], function(namespace, Array, CSS) {

	namespace.AddClassOnClick = function (dataAttribute, activeClass) {
		this.MENU_BUTTON_DATA_ATTR = dataAttribute;
		this.activeClass = activeClass || 'active';
	};

	namespace.AddClassOnClick.prototype.handleEvent = function (event) {
		var id = event.currentTarget.getAttribute(this.MENU_BUTTON_DATA_ATTR),
			menu = document.getElementById(id);

		if (CSS.hasClassName(menu, this.activeClass)) {
			CSS.removeClassName(menu, this.activeClass);
		} else {
			CSS.addClassName(menu, this.activeClass);
		}
	};

	namespace.AddClassOnClick.prototype.init = function () {
		var i,
			menuButtons = CSS.getElementsByDataAttribute(document, this.MENU_BUTTON_DATA_ATTR);

		for (i = menuButtons.length - 1; i >= 0; i--) {
			menuButtons[i].addEventListener('click', this);
		}
	};

	return namespace.AddClassOnClick;
});