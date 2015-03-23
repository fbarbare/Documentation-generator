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

        function dragmove() {            
            var x = d3.event.x,
                y = d3.event.y;

            d3.select(this).attr('transform', 'translate(' + x + ', ' + y + ')');
            // links.filter(function (l) {
            //     return l.source === d;
            // }).attr("x1", d.x).attr("y1", d.y);
        }

        drag = d3.behavior.drag()
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
                        linksData.push(d);
                        linksData[linksData.length - 1].target = id;
                        linksData[linksData.length - 1].source = d.memberOf + '-' + d.name;
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
                    d.targetElement = document.getElementById(d.target);
                })
                .attr('x1', function (d) { return d.x; })
                .attr('y1', function (d) { return d.y; })
                .attr('x2', function (d) {
                    return d.targetElement['__data__'].x;
                })
                .attr('y2', function (d) {
                    return d.targetElement['__data__'].y;
                })

        debugger;
    });
}());