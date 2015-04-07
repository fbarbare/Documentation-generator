define([
	'vendor/d3js/3.5.5/d3',
	'application/graph/Force'
], function(d3, Force) {

	function Graph(data, categories, config) {
		this.data = data;
		this.categories = categories;
		this.config = config;

		this.graph = {};
	}

	Graph.prototype.create = function () {
		var force = new Force(this.data, this.data.links, this.graph, this.config);
		force.create();
	};



	  //       svg = d3.select(config.wrapper).append('svg')
	  //           .attr('width' , config.size.width  + config.margin.left + config.margin.right)
	  //           .attr('height', config.size.height + config.margin.top  + config.margin.bottom)
	  //         .append('g')
	  //           .attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');

	  //       svg.append('defs').selectAll('marker')
	  //           .data(['end'])
	  //         .enter().append('marker')
	  //           .attr('id'          , String)
	  //           .attr('viewBox'     , '0 -5 10 10')
	  //           .attr('refX'        , 10)
	  //           .attr('refY'        , 0)
	  //           .attr('markerWidth' , 6)
	  //           .attr('markerHeight', 6)
	  //           .attr('orient'      , 'auto')
	  //         .append('path')
	  //           .attr('d', 'M0,-5L10,0L0,5');

			// // adapted from http://stackoverflow.com/questions/9630008
	  //       // and http://stackoverflow.com/questions/17883655
	  //       glow = svg.append('filter')
	  //           .attr('x'     , '-50%')
	  //           .attr('y'     , '-50%')
	  //           .attr('width' , '200%')
	  //           .attr('height', '200%')
	  //           .attr('id'    , 'blue-glow');

	  //       glow.append('feColorMatrix')
	  //           .attr('type'  , 'matrix')
	  //           .attr('values', '0 0 0 0  0 '
	  //                         + '0 0 0 0  0 '
	  //                         + '0 0 0 0  .7 '
	  //                         + '0 0 0 1  0 ');

	  //       glow.append('feGaussianBlur')
	  //           .attr('stdDeviation', 3)
	  //           .attr('result'      , 'coloredBlur');

	  //       glow.append('feMerge').selectAll('feMergeNode')
	  //           .data(['coloredBlur', 'SourceGraphic'])
	  //         .enter().append('feMergeNode')
	  //           .attr('in', String);

	  //       var legend = new Legend(data.categories, config.legend.templateId);
	  //       legend.create();

	return Graph;
});