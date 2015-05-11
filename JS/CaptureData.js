/*global CustomEvents*/
/*eslint strict:0*/
(function(classes, Utils){

	/**
	 * The CaptureData class is used to retrieve the value of the element we want to capture.
	 * @class CaptureData
	 */
	function CaptureData(){
	}

	/**
	 * The runCustomJSEvent method is used to run custom JavaScript on elements that are being captured. It is used so Tech services can add JavaScript to process elements they want.
	 * @memberof CaptureData
	 * @param {Number} id - It is used to identify captured data.
	 * @param {String} value - It is a value retrieved from DOM element.
	 * @param {Element} element - It is an DOM element.
	 * @returns {String} Value of the element processed by custom JavaScript.
	 */
	CaptureData.prototype.runCustomJSEvent = function(id, value, element){
			try { // We do a try/catch as this function will be written by Tech services and we have no control of it
					return CustomEvents.onGetCaptureValue(id, value, element);
			} catch (e) {
				Utils.shell.error(e);
					return value;
			}
	};

	/**
	 * The readValue method is used to read specific value from the DOM element based on the element type.
	 * @memberof CaptureData
	 * @param {Element} element - It is an DOM element.
	 * @param {String} type - It is a type of a DOM element. It is used to determine what value should be retrieved from it.
	 * @returns {String} Specific value of the element.
	 */
	CaptureData.prototype.readValue = function(element, type) {
		var capturedValue;

				switch (type.toLowerCase()) {
						case 'value':
								capturedValue = element.value;
								break;
						case 'checkbox':
								capturedValue = element.checked ? 'Checked' : 'Unchecked';
								break;
						case 'innerhtml':
						case 'text':
								capturedValue = Utils.capture.getInnerText(element);
								break;
						case 'src':
								capturedValue = element.src;
								break;
						case 'class':
								capturedValue = element.className;
								break;
						case 'id':
								capturedValue = element.id;
								break;
						case 'href':
								capturedValue = element.href;
								break;
						case 'visibility':
								capturedValue = element.style[type];
								break;
						default:
								capturedValue = element.getAttribute(type);

				}

				return capturedValue || '';
	};

	/**
	 * The getValue method is used to loop through all form mappings and capture the value from those elements.
	 * @memberof CaptureData
	 * @param {String} selector - It is CSS selector used to get the specific DOM element.
	 * @param {String} type - It is a type of a DOM element. It is used to determine what value should be retrieved from it.
	 * @param {Number} id - It is used to identify captured data.
	 * @returns {Array} Array of specific values of the elements.
	 */
	CaptureData.prototype.getValue = function(selector, type, id) {
		var i = 0,
			max = 0,
			values = [],
			currentValue = null,
			elements = null;

		if(selector === 'window.location.href'){
			values.push(Utils.domain.getHref());
		} else {
		elements = Utils.dom.querySelectorAll(selector);
		max = elements.length;
		for (i = 0; i < max; i++) {
			currentValue = this.readValue(elements[i], type);

				if (id) { // no customJS on the App mappings
				currentValue = this.runCustomJSEvent(id, currentValue, elements[i]);
			}
			values.push(currentValue);
			}
		}
		return values;
	};

	classes.CaptureData = CaptureData;

}(classes, Utils));
