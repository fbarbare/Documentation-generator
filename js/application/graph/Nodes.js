define([
	'vendor/d3js/3.5.5/d3',
    'application/graph/Drag',
    'Math',
    'Array',
    'Window',
    'geometry/LineSegment'
], function(d3, Drag, Math, Array, Window, LineSegment) {

	function Nodes(data, config, graph) {
        this.data = data;
        this.graph = graph;
        this.config = config;

        this.graph.selected = {};

        this.highlighted = null;
        this.showingDocs = false;
        this.mouseoutTimeout = false;
        this.docsClosePadding  = 8;
        this.desiredDocsHeight = 300;

        this.maxLineChars = 26;
        this.wrapChars = ' /_-.'.split('');
	}

    Nodes.prototype.finalizeLabelSize = function () {
        var self = this;
        this.graph.nodes.each(function(d) {
            var padding  = self.config.label.padding,
                margin   = self.config.label.margin,
                node   = d3.select(this),
                text   = node.selectAll('text'),
                first  = true,
                bounds = {},
                oldWidth;

            text.each(function() {
                var box = this.getBBox();
                if (first || box.x < bounds.x1) {
                    bounds.x1 = box.x;
                }
                if (first || box.y < bounds.y1) {
                    bounds.y1 = box.y;
                }
                if (first || box.x + box.width > bounds.x2) {
                    bounds.x2 = box.x + box.width;
                }
                if (first || box.y + box.height > bounds.y2) {
                    bounds.y2 = box.y + box.height;
                }
                first = false;
            }).attr('text-anchor', 'middle');

            oldWidth = bounds.x2 - bounds.x1;

            bounds.x1 -= oldWidth / 2;
            bounds.x2 -= oldWidth / 2;

            bounds.x1 -= padding.left;
            bounds.y1 -= padding.top;
            bounds.x2 += padding.left + padding.right;
            bounds.y2 += padding.top  + padding.bottom;

            node.select('rect')
                .attr('x', bounds.x1)
                .attr('y', bounds.y1)
                .attr('width' , bounds.x2 - bounds.x1)
                .attr('height', bounds.y2 - bounds.y1);

            d.extent = {
                left   : bounds.x1 - margin.left,
                right  : bounds.x2 + margin.left + margin.right,
                top    : bounds.y1 - margin.top,
                bottom : bounds.y2 + margin.top  + margin.bottom
            };

            d.edge = {
                left   : new LineSegment(bounds.x1, bounds.y1, bounds.x1, bounds.y2),
                right  : new LineSegment(bounds.x2, bounds.y1, bounds.x2, bounds.y2),
                top    : new LineSegment(bounds.x1, bounds.y1, bounds.x2, bounds.y1),
                bottom : new LineSegment(bounds.x1, bounds.y2, bounds.x2, bounds.y2)
            };
        });
    };

    Nodes.prototype.wrap = function (text) {
        if (text.length <= this.maxLineChars) {
            return new Array(text);
        } else {
            for (var k = 0; k < this.wrapChars.length; k++) {
                var c = this.wrapChars[k];
                for (var i = this.maxLineChars; i >= 0; i--) {
                    if (text.charAt(i) === c) {
                        var line = text.substring(0, i + 1);
                        return [line].concat(wrap(text.substring(i + 1)));
                    }
                }
            }
            return [text.substring(0, this.maxLineChars)]
                .concat(wrap(text.substring(this.maxLineChars)));
        }
    };

    Nodes.prototype.createLabel = function () {
        var self = this;
        self.graph.nodes.each(function(d) {
            var node  = d3.select(this),
                rect  = node.select('rect'),
                lines = self.wrap(d.name),
                ddy   = 1.1,
                dy    = -ddy * lines.length / 2 + .5;

            lines.forEach(function(line) {
                var text = node.append('text')
                    .text(line)
                    .attr('dy', dy + 'em');
                dy += ddy;
            });
        });
    };

    Nodes.prototype.createRects = function () {
        var self = this;
        this.graph.nodeRect = this.graph.nodes.append('rect')
            .attr('rx', 5)
            .attr('ry', 5)
            .attr('stroke', function(d) {
                return self.data.categories[d.type].strokeColor;
            })
            .attr('fill', function(d) {
                return self.data.categories[d.type].fillColor;
            })
            .attr('width' , 120)
            .attr('height', 30);
    };

    Nodes.prototype.createNodes = function () {
        var self = this;
        self.graph.nodes = self.graph.containerG.selectAll('.node')
            .data(self.graph.force.nodes())
          .enter().append('g')
            .attr('class', 'node')
            .call(self.graph.drag)
            .on('mouseover', function(d) {
                if (!self.graph.selected.obj) {
                    if (self.mouseoutTimeout) {
                        clearTimeout(self.mouseoutTimeout);
                        self.mouseoutTimeout = null;
                    }
                    self.drag.highlightObject(d);
                }
            })
            .on('mouseout', function() {
                if (!self.graph.selected.obj) {
                    if (self.mouseoutTimeout) {
                        clearTimeout(self.mouseoutTimeout);
                        self.mouseoutTimeout = null;
                    }
                    self.mouseoutTimeout = setTimeout(function() {
                        self.drag.highlightObject(null);
                    }, self.config.mouseoutTime);
                }
            });
    };

    Nodes.prototype.createGlow = function () {
        this.graph.glow = this.graph.containerG.append('filter')
            .attr('x'     , '-50%')
            .attr('y'     , '-50%')
            .attr('width' , '200%')
            .attr('height', '200%')
            .attr('id'    , 'blue-glow');

        this.graph.glow.append('feColorMatrix')
            .attr('type'  , 'matrix')
            .attr('values', '0 0 0 0  0 '
                          + '0 0 0 0  0 '
                          + '0 0 0 0  .7 '
                          + '0 0 0 1  0 ');

        this.graph.glow.append('feGaussianBlur')
            .attr('stdDeviation', 3)
            .attr('result'      , 'coloredBlur');

        this.graph.glow.append('feMerge').selectAll('feMergeNode')
            .data(['coloredBlur', 'SourceGraphic'])
          .enter().append('feMergeNode')
            .attr('in', String);
    };

	Nodes.prototype.create = function () {
        var self = this;

        this.createGlow();

        this.drag = new Drag(this.graph);
        this.drag.create();

        this.createNodes();
        this.createRects();
        this.createLabel();

        setTimeout(function() {
            self.finalizeLabelSize();

            self.graph.numTicks = 0;
            self.graph.preventCollision = false;
            self.graph.force.start();
            for (i = 0; i < self.config.ticksWithoutCollisions; i++) {
                self.graph.force.tick();
            }
            self.graph.preventCollision = true;
        });
	};

	return Nodes;
});