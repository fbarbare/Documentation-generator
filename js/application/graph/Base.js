define([
	'vendor/d3js/3.5.5/d3'
], function(d3) {

	function Base(graph, config) {
		this.graph = graph;
		this.config = config;
	}

	Base.prototype.create = function () {
        this.graph.svg = d3.select(this.config.wrapper).append('svg')
            .attr('width' , this.config.size.width - 5)
            .attr('height', this.config.size.height - 5);
        this.graph.containerG = this.graph.svg
			.append('g')
				.attr('transform', 'translate(' + this.config.margin.left + ',' + this.config.margin.top + ')');
	};

	Base.prototype.resize = function () {
        this.graph.svg
            .attr('width' , this.config.size.width - 5)
            .attr('height', this.config.size.height - 5);
	};

	return Base;
});