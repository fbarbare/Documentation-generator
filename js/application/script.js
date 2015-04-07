requirejs.config({
    baseUrl: 'js/utils',
    paths: {
        application: '../application',
        demo: '../demo',
        vendor: '../vendors',
        plugin: '../plug-ins',
        widget: '../widgets'
    }
});

requirejs([
	'plugin/CSS/AddClassOnClick',
	'application/drawGraph'
], function (AddClassOnClick, drawGraph) {
	var mobileMenu = new AddClassOnClick('data-menu-button', 'menu-active');
	mobileMenu.init();
});