define([
	'elements/getElements',
	'elements/classNames',
	'elements/attributes',
	'elements/nodes',
	'events/eventListeners'
], function(getElements, classNames, attributes, nodes, eventListeners) {

	function Legend(categories, templateId, graph) {
		this.categories = categories;
		this.templateId = templateId;
		this.graph = graph;
	}

	Legend.prototype.setElementsAsActive = function () {
	    var nodes = this.graph.nodes[0],
	        lines = this.graph.lines[0],
	        i;

	    for (i = nodes.length - 1; i >= 0; i--) {
	        classNames.svgRemove(nodes[i], 'inactive');
	    }
	    for (i = lines.length - 1; i >= 0; i--) {
	        classNames.svgRemove(lines[i], 'inactive');
	    }
	};
	Legend.prototype.setElementsAsInactive = function (key) {
	    var nodes = this.graph.nodes[0],
	        lines = this.graph.lines[0],
	        i;

	    for (i = nodes.length - 1; i >= 0; i--) {
	        if(nodes[i]['__data__'].type !== key && nodes[i]['__data__'].dependsGroups.indexOf(key) === -1) {
	            classNames.svgAdd(nodes[i], 'inactive');
	        }
	    }
	    for (i = lines.length - 1; i >= 0; i--) {
	        if(lines[i]['__data__'].source.type !== key && lines[i]['__data__'].target.type !== key) {
	            classNames.svgAdd(lines[i], 'inactive');
	        }
	    }
	};

	Legend.prototype.handleEvent = function (event) {
	    var key = attributes.get(event.currentTarget, 'data-legend-key');
		switch (event.type) {
			case 'mouseover':
				this.setElementsAsInactive(key);
				break;
			case 'mouseout':
				this.setElementsAsActive(key);
				break;
		}
	};
	

	Legend.prototype.create = function () {
	    var legendTemplate = getElements.byId(this.templateId),
	        template = nodes.cloneNode(legendTemplate, true),
	        parent = legendTemplate.parentNode,
	        currentClone,
	        elements,
	        key,
	        i;
	    
	    attributes.remove(template, 'id');
	    for (key in this.categories) {
	        currentClone = nodes.cloneNode(template, true);

	        attributes.set(currentClone, 'data-legend-key', key);
	        eventListeners.add(currentClone, 'mouseover', this);
	        eventListeners.add(currentClone, 'mouseout', this);

	        elements = getElements.byDataAttribute(currentClone, 'data-legend');
	        for (i = elements.length - 1; i >= 0; i--) {
	            switch (attributes.get(elements[i], 'data-legend')) {
	                case 'name':
	                    elements[i].innerHTML = this.categories[key].name
	                    break;
	                case 'square':
	                    elements[i].style.borderColor = this.categories[key].strokeColor;
	                    elements[i].style.backgroundColor = this.categories[key].fillColor;
	                    break;
	            }
	        }

	        nodes.appendChild(parent, currentClone);
	    }
	}

	return Legend;
});