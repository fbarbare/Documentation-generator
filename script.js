function getElementsByDataAttribute(parentElement, key, value) {
	if (parentElement !== null) {
		var allChild = parentElement.getElementsByTagName('*'),
			arrayElement = [],
			i = 0;
		for(i = 0; i < allChild.length; i = i + 1){
			if(allChild[i].hasAttribute(key) && (value === undefined || allChild[i].getAttribute(key) === value)){
				arrayElement.push(allChild[i])
			}
		}
		return arrayElement.length > 0 ? arrayElement : null;
	}
		
	return null;
}

function toggleMenu(event) {
	var id = event.currentTarget.getAttribute(MENU_BUTTON_DATA_ATTR),
		menu = document.getElementById(id);

	if (hasClassName(menu, 'active')) {
		addClassName(menu, 'active');
	} else {
		removeClassName(menu, 'active');
	}
}


var	MENU_BUTTON_DATA_ATTR = 'data-menu-button'
	menuButtons;

menuButtons = getElementsByTagName(document, MENU_BUTTON_DATA_ATTR);
for (var i = menuButtons.length - 1; i >= 0; i--) {
	menuButtons[i].addEventListener('click', openMenu);
};