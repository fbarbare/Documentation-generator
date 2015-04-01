requirejs.config({
    baseUrl: 'js/utils',
    paths: {
        demo: '../demo',
        vendor: '../vendors',
        plugin: '../plug-ins',
        widget: '../widgets'
    }
});

requirejs(['plugin/CSS/AddClassOnClick'],
function (AddClassOnClick) {
	var mobileMenu = new AddClassOnClick('data-menu-button', 'menu-active');
	mobileMenu.init();
});