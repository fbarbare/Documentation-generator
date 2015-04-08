define([
	'vendor/d3js/3.5.5/d3',
	'geometry/LineSegment',
	'Math'
], function(d3, LineSegment, Math) {

	function Force(data, links, graph, config) {
		this.data = data;
		this.links = links;
		this.graph = graph;
		this.config = config;

		this.numTicks = 0;
	}

	Force.prototype.preventCollisions = function () {
	    var obj,
	    	name,
	    	quadtree = d3.geom.quadtree(this.data.nodeValues);

	    for (name in this.data.nodes) {
	        obj = this.data.nodes[name],
	            ox1 = obj.x + obj.extent.left,
	            ox2 = obj.x + obj.extent.right,
	            oy1 = obj.y + obj.extent.top,
	            oy2 = obj.y + obj.extent.bottom;

	        quadtree.visit(function(quad, x1, y1, x2, y2) {
	            if (quad.point && quad.point !== obj) {
	                // Check if the rectangles intersect
	                var p   = quad.point,
	                    px1 = p.x + p.extent.left,
	                    px2 = p.x + p.extent.right,
	                    py1 = p.y + p.extent.top,
	                    py2 = p.y + p.extent.bottom,
	                    ix  = (px1 <= ox2 && ox1 <= px2 && py1 <= oy2 && oy1 <= py2);
	                if (ix) {
	                    var xa1 = ox2 - px1, // shift obj left , p right
	                        xa2 = px2 - ox1, // shift obj right, p left
	                        ya1 = oy2 - py1, // shift obj up   , p down
	                        ya2 = py2 - oy1, // shift obj down , p up
	                        adj = Math.min(xa1, xa2, ya1, ya2);

	                    if (adj == xa1) {
	                        obj.x -= adj / 2;
	                        p.x   += adj / 2;
	                    } else if (adj == xa2) {
	                        obj.x += adj / 2;
	                        p.x   -= adj / 2;
	                    } else if (adj == ya1) {
	                        obj.y -= adj / 2;
	                        p.y   += adj / 2;
	                    } else if (adj == ya2) {
	                        obj.y += adj / 2;
	                        p.y   -= adj / 2;
	                    }
	                }
	                return ix;
	            }
	        });
	    }
	}

	Force.prototype.tick = function (e) {
		var name,
			obj,
			isIE = false;

	    this.numTicks++;

	    for (name in this.data.nodes) {
	        obj = this.data.nodes[name];

	        obj.positionConstraints.forEach(function(c) {
	            var w = c.weight * e.alpha;
	            if (!isNaN(c.x)) {
	                obj.x = (c.x * w + obj.x * (1 - w));
	            }
	            if (!isNaN(c.y)) {
	                obj.y = (c.y * w + obj.y * (1 - w));
	            }
	        });
	    }

	    if (this.graph.preventCollision) {
	        this.preventCollisions();
	    }

	    this.graph.lines
	        .attr('x1', function(d) {
	            return d.source.x;
	        })
	        .attr('y1', function(d) {
	            return d.source.y;
	        })
	        .each(function(d) {
	            if (isIE) {
	                // Work around IE bug regarding paths with markers
	                // Credit: #6 and http://stackoverflow.com/a/18475039/106302
	                this.parentNode.insertBefore(this, this);
	            }

	            var x    = d.target.x,
	                y    = d.target.y,
	                line = new LineSegment(d.source.x, d.source.y, x, y);

	            for (var e in d.target.edge) {
	                var ix = line.intersect(d.target.edge[e].offset(x, y));
	                if (ix.in1 && ix.in2) {
	                    x = ix.x;
	                    y = ix.y;
	                    break;
	                }
	            }

	            d3.select(this)
	                .attr('x2', x)
	                .attr('y2', y);
	        });

	    this.graph.nodes
	    	.attr('transform', function(d) {
	        	return 'translate(' + d.x + ',' + d.y + ')';
	    	});
	};

	Force.prototype.create = function () {
		this.graph.force = d3.layout.force()
			.nodes(this.data.nodeValues)
			.links(this.data.links)
			.linkStrength(function(d) { return d.strength; })
			.size([this.config.size.width, this.config.size.height])
			.linkDistance(this.config.linkDistance)
			.charge(this.config.charge)
			.on('tick', this.tick.bind(this));
	};

	return Force;
});