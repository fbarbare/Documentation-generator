define([
	'vendor/d3js/3.5.5/d3'
], function(d3) {

	function Lines(graph) {
		this.graph = graph;
	}

	Lines.prototype.create = function () {
        this.graph.containerG.append('defs').selectAll('marker')
            .data(['end'])
          .enter().append('marker')
            .attr('id'          , String)
            .attr('viewBox'     , '0 -5 10 10')
            .attr('refX'        , 10)
            .attr('refY'        , 0)
            .attr('markerWidth' , 6)
            .attr('markerHeight', 6)
            .attr('orient'      , 'auto')
          .append('path')
            .attr('d', 'M0,-5L10,0L0,5');

        this.graph.lines = this.graph.containerG.append('g').selectAll('.link')
            .data(this.graph.force.links())
          .enter().append('line')
            .attr('class', 'link');
	};

	return Lines;
});