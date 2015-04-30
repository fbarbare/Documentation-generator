define([
	'vendor/d3js/3.5.5/d3',
    'Math',
    'Window'
], function(d3, Math, Window) {

	function Drag(graph) {
		this.graph = graph;
        
        this.highlighted = null;
        this.showingDocs = false;
        this.docsClosePadding  = 8;
        this.desiredDocsHeight = 300;
	}

    Drag.prototype.resize = function (showDocs) {
        var docsHeight  = 0,
            graphHeight = 0,
            $docs       = $('#docs-container'),
            $graph      = $('#graph-container'),
            $close      = $('#docs-close');

        if (typeof showDocs == 'boolean') {
            showingDocs = showDocs;
            $docs[showDocs ? 'show' : 'hide']();
        }

        if (showingDocs) {
            docsHeight = desiredDocsHeight;
            $docs.css('height', docsHeight + 'px');
        }

        graphHeight = Window.innerHeight - docsHeight;
        $graph.css('height', graphHeight + 'px');

        $close.css({
            top   : graphHeight + docsClosePadding + 'px',
            right : Window.innerWidth - $docs[0].clientWidth + docsClosePadding + 'px'
        });
    };

    Drag.prototype.deselectObject = function (doResize) {
        if (doResize || typeof doResize == 'undefined') {
            this.resize(false);
        }
        this.graph.nodes.classed('selected', false);
        this.graph.selected = {};
        this.highlightObject(null);
    };
    Drag.prototype.highlightObject = function (obj) {
        if (obj) {
            if (obj !== this.highlighted) {
                this.graph.nodes.classed('inactive', function(d) {
                    return (obj !== d
                         && d.depends.indexOf(obj.name) == -1
                         && d.dependedOnBy.indexOf(obj.name) == -1);
                });
                this.graph.lines.classed('inactive', function(d) {
                    return (obj !== d.source && obj !== d.target);
                });
            }
            this.highlighted = obj;
        } else {
            if (this.highlighted) {
                this.graph.nodes.classed('inactive', false);
                this.graph.lines.classed('inactive', false);
            }
            this.highlighted = null;
        }
    };
    Drag.prototype.selectObject = function (obj, el) {
        var node;

        if (el) {
            node = d3.select(el);
        } else {
            node.each(function(d) {
                if (d === obj) {
                    node = d3.select(el = this);
                }
            });
        }
        if (!node) return;

        if (node.classed('selected')) {
            deselectObject();
            return;
        }
        deselectObject(false);

        this.graph.selected = {
            obj : obj,
            el  : el
        };

        highlightObject(obj);

        node.classed('selected', true);
        $('#docs').html(obj.docs);
        $('#docs-container').scrollTop(0);
        resize(true);

        var $graph   = $('#graph-container'),
            nodeRect = {
                left   : obj.x + obj.extent.left + config.margin.left,
                top    : obj.y + obj.extent.top  + config.margin.top,
                width  : obj.extent.right  - obj.extent.left,
                height : obj.extent.bottom - obj.extent.top
            },
            graphRect = {
                left   : $graph.scrollLeft(),
                top    : $graph.scrollTop(),
                width  : $graph.width(),
                height : $graph.height()
            };
        if (nodeRect.left < graphRect.left ||
            nodeRect.top  < graphRect.top  ||
            nodeRect.left + nodeRect.width  > graphRect.left + graphRect.width ||
            nodeRect.top  + nodeRect.height > graphRect.top  + graphRect.height) {

            $graph.animate({
                scrollLeft : nodeRect.left + nodeRect.width  / 2 - graphRect.width  / 2,
                scrollTop  : nodeRect.top  + nodeRect.height / 2 - graphRect.height / 2
            }, 500);
        }
    };

	Drag.prototype.create = function () {
        var self = this,
            draggedThreshold = d3.scale.linear()
            .domain([0, 0.1])
            .range([5, 20])
            .clamp(true);

        function dragged(d) {
            var threshold = draggedThreshold(self.graph.force.alpha()),
                dx        = d.oldX - d.px,
                dy        = d.oldY - d.py;
            if (Math.abs(dx) >= threshold || Math.abs(dy) >= threshold) {
                d.dragged = true;
            }
            return d.dragged;
        }

        self.graph.drag = d3.behavior.drag()
            .origin(function(d) { return d; })
            .on('dragstart', function(d) {
                d.oldX    = d.x;
                d.oldY    = d.y;
                d.dragged = false;
                d.fixed |= 2;
            })
            .on('drag', function(d) {
                d.px = d3.event.x;
                d.py = d3.event.y;
                if (dragged(d)) {
                    if (!self.graph.force.alpha()) {
                        self.graph.force.alpha(.025);
                    }
                }
            })
            .on('dragend', function(d) {
                if (!dragged(d)) {
                    self.selectObject(d, self);
                }
                d.fixed &= ~6;
            });
	};

	return Drag;
});