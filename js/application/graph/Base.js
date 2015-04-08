define([
	'vendor/d3js/3.5.5/d3'
], function(d3) {

	function Base(graph, config) {
		this.graph = graph;
		this.config = config;
	}

	Base.prototype.create = function () {
        this.graph.svg = d3.select(this.config.wrapper).append('svg')
            .attr('width' , this.config.size.width  + this.config.margin.left + this.config.margin.right)
            .attr('height', this.config.size.height + this.config.margin.top  + this.config.margin.bottom)
          .append('g')
            .attr('transform', 'translate(' + this.config.margin.left + ',' + this.config.margin.top + ')');
	};

	return Base;
});