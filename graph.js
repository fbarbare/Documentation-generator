var data,
    config,
    line,
    node,
    numTicks,
    preventCollision,
    selected    = {},
    highlighted = null,
    isIE        = false;
    
var showingDocs       = false,
    docsClosePadding  = 8,
    desiredDocsHeight = 300;
function getElementsByDataAttribute(parentElement, key, value) {
    if (parentElement !== null) {
        var allChild = parentElement.getElementsByTagName('*'),
            arrayElement = new Array(),
            i = 0;

        for(i = 0; i < allChild.length; i = i + 1){
            if(allChild[i].hasAttribute(key) && (value === undefined || allChild[i].getAttribute(key) === value)){
                arrayElement.push(allChild[i])
            }
        }
        return arrayElement.length > 0 ? arrayElement : null;
    }
}

function buildLinks(nodes, config) {
    var key,
        link,
        object,
        dependencyIndex,
        links = [];

    for (key in nodes) {
        object = nodes[key];
        for (dependencyIndex in object.depends) {
            link = {
                source : nodes[object.depends[dependencyIndex]],
                target : object
            };
            link.strength = config.linkStrength;
            links.push(link);
        }
    }

    return links;
}

function generateLegend(categories, config) {
    var legendTemplate = document.getElementById(config.legend.templateId),
        template = legendTemplate.cloneNode(true),
        parent = legendTemplate.parentNode,
        currentClone,
        elements,
        max,
        key,
        j;
    
    template.removeAttribute('id');
    max = categories.length;
    for (key in categories) {
        currentClone = template.cloneNode(true);
        currentClone.setAttribute('data-legend-key', key);
        elements = getElementsByDataAttribute(currentClone, 'data-legend');
        for (j = elements.length - 1; j >= 0; j--) {
            switch (elements[j].getAttribute('data-legend')) {
                case 'name':
                    elements[j].innerHTML = categories[key].name
                    break;
                case 'square':
                    elements[j].style.borderColor = categories[key].strokeColor;
                    elements[j].style.backgroundColor = categories[key].fillColor;
                    break;
            }
        }

        parent.appendChild(currentClone);
    }
}

(function(){
    d3.json('config.json', function(json) {
        var wrapper;
        config = json;

        wrapper = document.querySelector(config.wrapper);
        if(config.size.width === 'auto'){
            config.size.width = wrapper.offsetWidth;
        }
        if(config.size.height === 'auto'){
            config.size.height = wrapper.offsetHeight;
        }
    });

    d3.json('data.json', function(json) {
        var draggedThreshold,
            mouseoutTimeout,
            nodeRect,
            wrapper,
            legend,
            force,
            glow,
            drag,
            svg;


        data = json;
        data.links = buildLinks(data.nodes, config);
        data.nodeValues = d3.values(data.nodes);

        force = d3.layout.force()
            .nodes(data.nodeValues)
            .links(data.links)
            .linkStrength(function(d) { return d.strength; })
            .size([config.size.width, config.size.height])
            .linkDistance(config.linkDistance)
            .charge(config.charge)
            .on('tick', tick);

        svg = d3.select(config.wrapper).append('svg')
            .attr('width' , config.size.width  + config.margin.left + config.margin.right)
            .attr('height', config.size.height + config.margin.top  + config.margin.bottom)
          .append('g')
            .attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');

        svg.append('defs').selectAll('marker')
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

        // adapted from http://stackoverflow.com/questions/9630008
        // and http://stackoverflow.com/questions/17883655
        glow = svg.append('filter')
            .attr('x'     , '-50%')
            .attr('y'     , '-50%')
            .attr('width' , '200%')
            .attr('height', '200%')
            .attr('id'    , 'blue-glow');

        glow.append('feColorMatrix')
            .attr('type'  , 'matrix')
            .attr('values', '0 0 0 0  0 '
                          + '0 0 0 0  0 '
                          + '0 0 0 0  .7 '
                          + '0 0 0 1  0 ');

        glow.append('feGaussianBlur')
            .attr('stdDeviation', 3)
            .attr('result'      , 'coloredBlur');

        glow.append('feMerge').selectAll('feMergeNode')
            .data(['coloredBlur', 'SourceGraphic'])
          .enter().append('feMergeNode')
            .attr('in', String);

        generateLegend(data.categories, config);

        // legend = svg.append('g')
        //     .attr('class', 'legend')
        //     .attr('x', 0)
        //     .attr('y', 0)
        //   .selectAll('.category')
        //     .data(d3.values(data.categories))
        //   .enter().append('g')
        //     .attr('class', 'category');

        // legend.append('rect')
        //     .attr('x', config.legend.xOffset)
        //     .attr('y', function(d, i) {
        //         return config.legend.yOffset + i * config.legend.lineHeight;
        //     })
        //     .attr('height', config.legend.rectHeight)
        //     .attr('width' , config.legend.rectWidth)
        //     .attr('fill'  , function(d) {
        //         return d.fillColor;
        //     })
        //     .attr('stroke', function(d) {
        //         return d.strokeColor;
        //     });

        // legend.append('text')
        //     .attr('x', config.legend.xOffsetText)
        //     .attr('y', function(d, i) {
        //         return config.legend.yOffsetText + i * config.legend.lineHeight;
        //     })
        //     .text(function(d) {
        //         return d.typeName + (d.group ? ': ' + d.group : '');
        //     });

        line = svg.append('g').selectAll('.link')
            .data(force.links())
          .enter().append('line')
            .attr('class', 'link');

        draggedThreshold = d3.scale.linear()
            .domain([0, 0.1])
            .range([5, 20])
            .clamp(true);

        function dragged(d) {
            var threshold = draggedThreshold(force.alpha()),
                dx        = d.oldX - d.px,
                dy        = d.oldY - d.py;
            if (Math.abs(dx) >= threshold || Math.abs(dy) >= threshold) {
                d.dragged = true;
            }
            return d.dragged;
        }

        drag = d3.behavior.drag()
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
                    if (!force.alpha()) {
                        force.alpha(.025);
                    }
                }
            })
            .on('dragend', function(d) {
                if (!dragged(d)) {
                    selectObject(d, this);
                }
                d.fixed &= ~6;
            });

        // $('#graph-container').on('click', function(e) {
        //     if (!$(e.target).closest('.node').length) {
        //         deselectObject();
        //     }
        // });

        node = svg.selectAll('.node')
            .data(force.nodes())
          .enter().append('g')
            .attr('class', 'node')
            .call(drag)
            .on('mouseover', function(d) {
                if (!selected.obj) {
                    if (mouseoutTimeout) {
                        clearTimeout(mouseoutTimeout);
                        mouseoutTimeout = null;
                    }
                    highlightObject(d);
                }
            })
            .on('mouseout', function() {
                if (!selected.obj) {
                    if (mouseoutTimeout) {
                        clearTimeout(mouseoutTimeout);
                        mouseoutTimeout = null;
                    }
                    mouseoutTimeout = setTimeout(function() {
                        highlightObject(null);
                    }, config.mouseoutTime);
                }
            });

        nodeRect = node.append('rect')
            .attr('rx', 5)
            .attr('ry', 5)
            .attr('stroke', function(d) {
                return data.categories[d.type].strokeColor;
            })
            .attr('fill', function(d) {
                return data.categories[d.type].fillColor;
            })
            .attr('width' , 120)
            .attr('height', 30);

        node.each(function(d) {
            var node  = d3.select(this),
                rect  = node.select('rect'),
                lines = wrap(d.name),
                ddy   = 1.1,
                dy    = -ddy * lines.length / 2 + .5;

            lines.forEach(function(line) {
                var text = node.append('text')
                    .text(line)
                    .attr('dy', dy + 'em');
                dy += ddy;
            });
        });

        setTimeout(function() {
            var i;
            node.each(function(d) {
                var padding  = config.labelPadding,
                    margin   = config.labelMargin,
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
                    left   : new geo.LineSegment(bounds.x1, bounds.y1, bounds.x1, bounds.y2),
                    right  : new geo.LineSegment(bounds.x2, bounds.y1, bounds.x2, bounds.y2),
                    top    : new geo.LineSegment(bounds.x1, bounds.y1, bounds.x2, bounds.y1),
                    bottom : new geo.LineSegment(bounds.x1, bounds.y2, bounds.x2, bounds.y2)
                };
            });

            numTicks = 0;
            preventCollision = false;
            force.start();
            for (i = 0; i < config.ticksWithoutCollisions; i++) {
                force.tick();
            }
            preventCollision = true;
        });
    });

}());

var maxLineChars = 26,
    wrapChars    = ' /_-.'.split('');

function wrap(text) {
    if (text.length <= maxLineChars) {
        return [text];
    } else {
        for (var k = 0; k < wrapChars.length; k++) {
            var c = wrapChars[k];
            for (var i = maxLineChars; i >= 0; i--) {
                if (text.charAt(i) === c) {
                    var line = text.substring(0, i + 1);
                    return [line].concat(wrap(text.substring(i + 1)));
                }
            }
        }
        return [text.substring(0, maxLineChars)]
            .concat(wrap(text.substring(maxLineChars)));
    }
}

function preventCollisions() {
    var quadtree = d3.geom.quadtree(data.nodeValues);

    for (var name in data.nodes) {
        var obj = data.nodes[name],
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

function tick(e) {
    numTicks++;

    for (var name in data.nodes) {
        var obj = data.nodes[name];

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

    if (preventCollision) {
        preventCollisions();
    }

    line
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
                line = new geo.LineSegment(d.source.x, d.source.y, x, y);

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

    node.attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')';
    });
}

function selectObject(obj, el) {
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

    selected = {
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
}

function deselectObject(doResize) {
    if (doResize || typeof doResize == 'undefined') {
        resize(false);
    }
    node.classed('selected', false);
    selected = {};
    highlightObject(null);
}

function highlightObject(obj) {
    if (obj) {
        if (obj !== highlighted) {
            node.classed('inactive', function(d) {
                return (obj !== d
                     && d.depends.indexOf(obj.name) == -1
                     && d.dependedOnBy.indexOf(obj.name) == -1);
            });
            line.classed('inactive', function(d) {
                return (obj !== d.source && obj !== d.target);
            });
        }
        highlighted = obj;
    } else {
        if (highlighted) {
            node.classed('inactive', false);
            line.classed('inactive', false);
        }
        highlighted = null;
    }
}

function resize(showDocs) {
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

    graphHeight = window.innerHeight - docsHeight;
    $graph.css('height', graphHeight + 'px');

    $close.css({
        top   : graphHeight + docsClosePadding + 'px',
        right : window.innerWidth - $docs[0].clientWidth + docsClosePadding + 'px'
    });
}
