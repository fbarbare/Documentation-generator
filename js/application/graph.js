define([
	'vendor/d3js/3.5.5/d3',
	'elements/getElements'
], function(d3, getElements) {

	function buildLinks(nodes, config) {
	    var key,
	        link,
	        target,
	        source,
	        dependencyIndex,
	        links = [];

	    for (key in nodes) {
	        target = nodes[key];
	        target.dependsGroups = target.dependsGroups || [];

	        for (dependencyIndex in target.depends) {
	            source = nodes[target.depends[dependencyIndex]];
	            source.dependsGroups = source.dependsGroups || [];

	            if (target.dependsGroups.indexOf(source.type) === -1) {
	                target.dependsGroups.push(source.type);
	            }
	            if (source.dependsGroups.indexOf(target.type) === -1) {
	                source.dependsGroups.push(target.type);
	            }

	            link = {
	                source : source,
	                target : target
	            };
	            link.strength = config.linkStrength;
	            links.push(link);
	        }
	    }

	    return links;
	}

    d3.json('config.json', function(json) {
        var wrapper,
        	config = json;

        config.wrapper = config.wrapper || 'body';
        wrapper = getElements.querySelector(document, config.wrapper);
        if(config.size.width === 'auto'){
            config.size.width = wrapper.offsetWidth;
        }
        if(config.size.height === 'auto'){
            config.size.height = wrapper.offsetHeight;
        }

        d3.json('data.json', function(json) {
	        data = json;
	        data.links = buildLinks(data.nodes, config);
	        data.nodeValues = d3.values(data.nodes);
	    });
    });

	return graph;
});