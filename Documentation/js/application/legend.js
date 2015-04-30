define([
	'elements/getElements',
	'elements/classNames',
	'elements/attributes',
	'elements/nodes',
	'events/eventListeners'
], function(getElements, classNames, attributes, nodes, eventListeners) {

	function legend(categories, templateId, nodes, lines) {
		this.categories = categories;
		this.templateId = templateId;
		this.nodes = nodes;
		this.lines = lines;
	}

	legend.prototype.setElementsAsActive = function () {
	    var nodes = this.nodes[0],
	        lines = this.lines[0],
	        i;

	    for (i = nodes.length - 1; i >= 0; i--) {
	        classNames.remove(nodes[i], 'inactive');
	    }
	    for (i = lines.length - 1; i >= 0; i--) {
	        classNames.remove(lines[i], 'inactive');
	    }
	};
	legend.prototype.setElementsAsInactive = function (key) {
	    var nodes = this.nodes[0],
	        lines = this.lines[0],
	        i;

	    for (i = nodes.length - 1; i >= 0; i--) {
	        if(nodes[i]['__data__'].type !== key && nodes[i]['__data__'].dependsGroups.indexOf(key) === -1) {
	            classNames.add(nodes[i], 'inactive');
	        }
	    }
	    for (i = lines.length - 1; i >= 0; i--) {
	        if(lines[i]['__data__'].source.type !== key && lines[i]['__data__'].target.type !== key) {
	            classNames.add(lines[i], 'inactive');
	        }
	    }
	};

	legend.prototype.handleEvent = function (event) {
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
	

	legend.prototype.create = function () {
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

	return legend;
});