(function(){
    var width = window.innerWidth,
        height = window.innerHeight;

    var svg = d3.select('body').append('svg')
        .attr('width', width)
        .attr('height', height);

    function LightenDarkenColor(col, amt) {
        var b,
            g,
            r,
            num,
            usePound = false;

        if (col[0] == '#') {
            col = col.slice(1);
            usePound = true;
        }
        num = parseInt(col,16);
        r = (num >> 16) + amt;
        if (r > 255) r = 255;
        else if  (r < 0) r = 0;

        b = ((num >> 8) & 0x00FF) + amt;
        if (b > 255) b = 255;
        else if  (b < 0) b = 0;

        g = (num & 0x0000FF) + amt;
        if (g > 255) g = 255;
        else if (g < 0) g = 0;

        return (usePound?'#':'') + (g | (b << 8) | (r << 16)).toString(16);
    }

    d3.json('data.json', function(error, data) {
        var g,
            drag,
            texts,
            rects,
            width,
            height,
            glinks,
            linksData = [],
            currentElement;

        function dragstarted() {            
            d3.event.sourceEvent.stopPropagation();
        }
        function dragmove(d) {            
            var x = d3.event.x,
                y = d3.event.y;

            d3.select(this).attr('transform', 'translate(' + x + ', ' + y + ')');
            links.filter(function (l) {
                if(l.source.x === d.x && l.source.y === d.y) {
                    l.source.x = x;
                    l.source.y = y;
                    return true;
                }
                return false;
            }).attr("x1", x).attr("y1", y);
            links.filter(function (l) {
                if(l.target.x === d.x && l.target.y === d.y) {
                    l.target.x = x;
                    l.target.y = y;
                    return true;
                }
                return false;
            }).attr("x2", x).attr("y2", y);

            d.x = x;
            d.y = y;
        }

        drag = d3.behavior.drag()
            .origin(function(d) { return d; })
            .on("dragstart", dragstarted)
            .on("drag", dragmove);

        texts = svg.append('g')
                .attr('class', 'nodes')
            .selectAll('g')
                .data(data.functions)
            .enter().append('g')
                .attr('class', 'node')
                .attr('id', function (d) {
                    return d.memberOf + '-' + d.name;
                })
                .attr('transform', function (d) {
                    return 'translate(' + d.x + ', ' + d.y + ')';
                })
                .call(drag)
            .append('text')
                .text(function (d) {
                    return d.name;
                })
                .attr('class', 'text')
                .attr('text-anchor', 'middle')
                .attr('dy', '-0.050000000000000044em');

        rects = svg.selectAll('.node')
            .insert('rect', 'text')
                .attr("data-generation", function (d) {
                    d.links.forEach(function (id) {
                        var data = {
                            source: {
                                id: d.memberOf + '-' + d.name,
                                element: d.currentElement,
                                x: d.x,
                                y: d.y
                            },
                            target: {
                                id: id
                            }
                        };

                        linksData.push(data);
                    });

                    d.currentElement = document.getElementById(d.memberOf + '-' + d.name);
                    d.height = d.currentElement.getBBox().height + 6;
                    d.width = d.currentElement.getBBox().width + 6;
                })
                .attr("x", function (d) {
                    return -(d.width)/2;
                })
                .attr("y", function (d) {
                    return -(d.height)/2 - 3;
                })
                .attr("width", function (d) {
                    return d.width;
                })
                .attr("height", function (d) {
                    return d.height;
                })
                .attr("rx", "5")
                .attr("ry", "5")
                .attr("fill", function (d) {
                    d.color = data.classes[d.memberOf].color;
                    return LightenDarkenColor(d.color, 100 );
                })
                .attr("stroke", function (d) {
                    return d.color;
                });

        links = svg.insert('g', '.nodes')
                .attr('class', 'links')
            .selectAll('line')
                .data(linksData)
            .enter().append('line')
                .attr('class', 'link')
                .attr('data-generation', function (d) {
                    d.target.element = document.getElementById(d.target.id);
                    d.target.x = d.target.element['__data__'].x;
                    d.target.y = d.target.element['__data__'].y;
                })
                .attr('x1', function (d) { return d.source.x; })
                .attr('y1', function (d) { return d.source.y; })
                .attr('x2', function (d) {
                    return d.target.x;
                })
                .attr('y2', function (d) {
                    return d.target.y;
                });
    });
}());