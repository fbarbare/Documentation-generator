define([
	'vendor/d3js/3.5.5/d3',
	'application/graph/Force',
	'application/graph/Base',
	'application/graph/Legend',
	'application/graph/Lines',
	'application/graph/Nodes',
	'application/graph/Drag',
	'elements/getElements'
], function(d3, Force, Base, Legend, Lines, Nodes, Drag, getElements) {

	function Graph(data, categories, config) {
		this.data = data;
		this.categories = categories;
		this.config = config;

		this.graph = {};
	}

	Graph.prototype.getSize = function (wrapper) {
        var element,
        	size = {};

        wrapper = wrapper || 'body';
        element = getElements.querySelector(document, wrapper);

        size = {};
        size.width = element.offsetWidth;
        size.height = element.offsetHeight;

        return size;
	};

	Graph.prototype.create = function () {
		this.config.size = this.getSize(this.config.wrapper);
		
		this.force = new Force(this.data, this.data.links, this.graph, this.config);
		this.force.create();

		this.base = new Base(this.graph, this.config);
		this.base.create();

		this.legend = new Legend(this.data.categories, this.config.legend.templateId, this.graph);
		this.legend.create();

		this.lines = new Lines(this.graph);
		this.lines.create();
		
		this.nodes = new Nodes(this.data, this.config, this.graph);
		this.nodes.create();

		window.graph = this;
	};

	Graph.prototype.resize = function () {
		this.config.size = this.getSize(this.config.wrapper);

		this.base.resize();
		this.force.resize();
	};

	return Graph;
});