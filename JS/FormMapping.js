/*eslint strict:0,no-fallthrough:0*/
(function(classes, Utils){
    var alreadyInit = false;

  /**
   * The FormMapping class is process the form mappings for the page. It captures the required data on specific events (onload, onchange or continuously) and send them to data receivers.
   * @function FormMapping
   * @param {Array} formMappings - It is an array of all form mappings for the website
   * @returns {String} Value of the element processed by custom JavaScript.
   */
    function splitFormMappingsByEvent (formMappings) {
        var splitFormMappings = {
                onLoadFormMappings: [],
                onChangeFormMappings: [],
                dynamicFormMappings: []
            },
            i;

        for (i = formMappings.length - 1; i >= 0; i--) {
            formMappings[i].identifypage = 'false';
            switch(formMappings[i].DomEvent){
                case 'OnLoad':
                    splitFormMappings.onLoadFormMappings.push(formMappings[i]);
                    break;
                case 'OnChange':
                    splitFormMappings.onChangeFormMappings.push(formMappings[i]);
                    break;
                case 'OnloadOnChange':
                    splitFormMappings.onLoadFormMappings.push(formMappings[i]);
                    splitFormMappings.onChangeFormMappings.push(formMappings[i]);
                    break;
                case 'DynamicPageIdentified':
                    formMappings[i].identifypage = 'true';
                case 'DynamicActivity':
                    splitFormMappings.dynamicFormMappings.push(formMappings[i]);
                    break;
            }
        }

        return splitFormMappings;
    }

  /**
   * The FormMapping class is process the form mappings for the page. It captures the required data on specific events (onload, onchange or continuously) and sends them to data receivers.
   * @class FormMapping
   * @param {Array} formMappings - It is an array of all form mappings for the website. Form mappings are taken from tag.js file.
   * @param {Function} callToCaptureData - It is a call to CaptureData.js that is responsible for retrieving data from DOM elements.
   * @param {Function} callToSendData - It is a call to FormMappingSendData.js that is responsible for sending data to data receivers.
   * @param {complianceManager} complianceManager - Class used to show compliance box when needed (required in some countries by law).
   */
    function FormMapping (formMappings, callToCaptureData, callToSendData, complianceManager) {
        var splitFormMappings = splitFormMappingsByEvent(formMappings);

        this.onLoadFormMappings = splitFormMappings.onLoadFormMappings;
        this.onChangeFormMappings = splitFormMappings.onChangeFormMappings;
        this.dynamicFormMappings = splitFormMappings.dynamicFormMappings;

        this.dynamicFormMappingInterval = null;

        this.callToCaptureData = callToCaptureData;
        this.callToSendData = callToSendData;
        this.complianceManager = complianceManager;
    }

  /**
   * The checkForCompliance method is used to check if captured input is an email address, and if so is responsible for showing compliance box for user in countries that it is required.
   * @memberof FormMapping
   * @param {Object} formMapping - It is objects with detailed information about element and its value that we want to capture.
   */
    FormMapping.prototype.checkForCompliance = function (formMapping) {
        if (formMapping.isEmail) {
            if (this.complianceManager && this.complianceManager.complianceRequired() && this.complianceManager.showCompliance()) {
                this.complianceManager.showEmailAuthForm(formMapping.name);
            }
        }
    };

  /**
   * The processData method is used to process (capture and send) form mappings found in tag.js file.
   * @memberof FormMapping
   * @param {Object} formMapping - It is objects with detailed information about element and its value that we want to capture.
   * @param {String} capturedData - specific value retrieved from element identified by formMapping.
   */
    FormMapping.prototype.processData = function (formMapping, capturedData) {
        this.checkForCompliance(formMapping);
        this.callToSendData(formMapping, capturedData);
    };

  /**
   * The onLoadChangeEvents triggers processing of form mapping for both, on load event (when DOM is loaded) and on change (when element's value has been changed).
   * @memberof FormMapping
   * @param {Object} formMapping - It is objects with detailed information about element and its value that we want to capture.
   */
    FormMapping.prototype.onLoadChangeEvents = function (formMapping) {
        var capturedData = this.callToCaptureData(formMapping.ClientFieldName, formMapping.HtmlAttributeTag, formMapping.FormMappingId);
        if (capturedData.length > 0) {
            this.processData(formMapping, capturedData);
        }
    };

  /**
   * The addLoadEvent adds load event to all form mappings that are to be captured on DOM load.
   * @memberof FormMapping
   */
    FormMapping.prototype.addLoadEvent = function() {
        var i;

        for (i = this.onLoadFormMappings.length - 1; i >= 0; i--) {
            this.onLoadChangeEvents(this.onLoadFormMappings[i]);
        }
    };

  /**
   * The addChangeEvent adds on change event to all form mappings that are to be captured on change - when value of the element has been changed.
   * @memberof FormMapping
   */
    FormMapping.prototype.addChangeEvent = function() {
        var i = 0,
            j = 0,
            elements = null;

        for (i = this.onChangeFormMappings.length - 1; i >= 0; i--) {
            elements = Utils.dom.querySelectorAll(this.onChangeFormMappings[i].ClientFieldName);
            this.onChangeFormMappings[i].onLoadChangeEvents = Utils.functions.bind(this.onLoadChangeEvents, this, this.onChangeFormMappings[i]);

            for (j = elements.length - 1; j >= 0; j--) {
                Utils.event.addEvent(elements[j], 'change', this.onChangeFormMappings[i].onLoadChangeEvents);
            }
        }
    };

    /**
     * The onDynamicFormMappingInterval compares the last known value with current value of the element and if the value is different it processes it.
     * @memberof FormMapping
     */
    FormMapping.prototype.onDynamicFormMappingInterval = function() {
        var i = 0,
            currentValue = null;

        for (i = this.dynamicFormMappings.length - 1; i >= 0; i--) {
            currentValue = this.callToCaptureData(this.dynamicFormMappings[i].ClientFieldName, this.dynamicFormMappings[i].HtmlAttributeTag, this.dynamicFormMappings[i].FormMappingId);
            if(currentValue.length > 0){
                currentValue.splice(1, currentValue.length - 1);

                if (currentValue.length && currentValue[0] && currentValue[0] !== this.dynamicFormMappings[i].oldValue) {
                    this.dynamicFormMappings[i].oldValue = currentValue[0];
                    this.processData(this.dynamicFormMappings[i], currentValue);
                }
            }
        }
    };

  /**
   * The addDynamicEvent adds constant capturing (every 750 ms) on form mappings that should be captured constantly.
   * @memberof FormMapping
   */
    FormMapping.prototype.addDynamicEvent = function() {
        this.onDynamicFormMappingIntervalBinded = Utils.functions.bind(this.onDynamicFormMappingInterval, this);
        this.dynamicFormMappingInterval = setInterval(this.onDynamicFormMappingIntervalBinded, 750);
    };

  /**
   * The init initialize all form mappings by adding the listeners to all form mappings.
   * @memberof FormMapping
   */
    FormMapping.prototype.init = function() {
        if(!alreadyInit){
            alreadyInit = true;
            this.addLoadEvent();
            this.addChangeEvent();
            this.addDynamicEvent();
        }
    };

    classes.FormMapping = FormMapping;

}(classes, Utils));
