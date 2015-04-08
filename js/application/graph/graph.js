define([
	'vendor/d3js/3.5.5/d3',
	'application/graph/Force',
	'application/graph/Base',
	'application/graph/Legend',
	'application/graph/Lines',
	'application/graph/Nodes',
	'application/graph/Drag'
], function(d3, Force, Base, Legend, Lines, Nodes, Drag) {

	function Graph(data, categories, config) {
		this.data = data;
		this.categories = categories;
		this.config = config;

		this.graph = {};
	}

	Graph.prototype.create = function () {
		var force, base, legend, lines, nodes, drag;

		force = new Force(this.data, this.data.links, this.graph, this.config);
		force.create();

		base = new Base(this.graph, this.config);
		base.create();

		legend = new Legend(this.data.categories, this.config.legend.templateId, this.graph);
		legend.create();

		lines = new Lines(this.graph);
		lines.create();
		
		nodes = new Nodes(this.data, this.config, this.graph);
		nodes.create();
	};

	return Graph;
});