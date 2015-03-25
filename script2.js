function getCategoriesFormatedData(nodes) {
    var object = {},
        category,
        name,
        key;

    for (key in nodes) {
        object = nodes[key],
        name = object.type + ':' + (object.group || ''),
        category = graph.categories[name];

        object.categoryKey = name;
        if (!category) {
            category = graph.categories[name] = {
                name      : name,
                type     : object.type,
                typeName : (config.types[object.type] ? config.types[object.type].short : object.type),
                group    : object.group,
                count    : 0
            };
        }
        category.count++;
    }
}
function getLinksFormatedData(nodes) {
    var links = [],
        object,
        link,
        key;

    for (key in nodes) {
        object = nodes[key];
        for (linkIndex in object.linkedBy) {
            link = {
                source : nodes[object.linkedBy[linkIndex]],
                target : object
            };
            link.strength = (link.source.linkStrength || 1) * (link.target.linkStrength || 1);
            links.push(link);
        }
    }
    return links
}
function getNodesFormatedData(nodes, groups, width, height) {
    var object,
        group,
        key;

    for (key in nodes) {
        object = nodes[key];
        group = groups[object.group];
        object.linkStrength = 1;
        object.positionConstraints = [];

        object.positionConstraints.push({
            weight: group.weight,
            x: group.x * width,
            y: group.y * height
        });
    }

    return nodes;
}

function getFormatedData(nodes, groups, config) {
    var object = {};

    object.nodes = getNodesFormatedData(nodes, groups, config.width, config.height);
    object.links = getLinksFormatedData(nodes);
    object.categories = getCategoriesFormatedData(nodes);

    return object; 
}

(function(){
    var config = {
        width: window.innerWidth,
        height: window.innerHeight
    };

    var svg = d3.select("body").append("svg")
        .attr("width", config.width)
        .attr("height", config.height);



    d3.json("data.json", function(error, json) {

        data = getFormatedData(json.nodes, json.groups, config);

    });
}());