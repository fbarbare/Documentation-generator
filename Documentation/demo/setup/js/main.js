requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: '../../js/utils',
    //except, if the module ID starts with "vendor",
    //load it from the js/vendors directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        demo: '../demo',
        vendor: '../vendors',
        plugin: '../plug-ins',
        widget: '../widgets'
    }
});

// Start the main app logic.
requirejs(['Array'],
function (Array) {
    console.log('Hello World!');
    debugger;
});