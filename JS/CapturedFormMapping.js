/*eslint strict:0*/
(function(win, classes, Utils){
	'use strict';

	/**
	 * The CapturedFormMapping class is used in order to store and send the data captured by the FormMapping class.
	 * @class CapturedFormMapping
	 * @param {Object} tagData - An object containing all the config required for the class to work.
	 * @param {Function} callForChangedData - callback for when a value will have changed in the stored data.
	 * @param {Function} callToSendDataReceivers - call to make a request to the data receivers.
	 * @param {Array} pathForRequest - Path used to create the request.
	 */
	function CapturedFormMapping (tagData, callForChangedData, callToSendDataReceivers, pathForRequest) {
		this.callForChangedData = callForChangedData;
		this.callToSendDataReceivers = callToSendDataReceivers;
		this.pathForRequest = pathForRequest;

		this.data = [];
		this.basicParameters = {
			journeyCode: tagData.journeycode,
			captureUrl: Utils.domain.getHref().replace(/http(s)?\:\/\/(www\.)?/, '').replace(/([#;])/gi, '?'),
			customerId: tagData.captureConfig.customerid,
			identifyAbandonmentOr: tagData.captureConfig.IdentifyAbandonmentOr,
			numberIdentifiedFields: tagData.captureConfig.NumberIdentifiedFields
		};
	}

	/**
	 * This function is creating all the parameter structure for the request we will do to send the data captured to the data receivers
	 * @memberof CapturedFormMapping
	 * @param {Object} formMapping - The description of the data captured.
	 * @param {String} data - The data that has been captured.
	 * @param {Number} seriesNumber - The number of the data captured in case it is in a RawSerie type.
	 * @return {Object} It returns an object containing all the parameters for the request.
	 */
	CapturedFormMapping.prototype.getParameters = function (formMapping, data, seriesNumber) {
		var currentParameters = Utils.json.parseJSON(Utils.json.stringify(this.basicParameters));

		currentParameters.valueField = data;
		currentParameters.seriesNumber = seriesNumber;
		currentParameters.identifyPage = formMapping.identifypage;
		currentParameters.formMappingId = formMapping.FormMappingId;
		currentParameters.identifyAbandonment = formMapping.IdentifyAbandonment;
		currentParameters.fieldIdName = formMapping.ClientFieldName;

		return currentParameters;
	};

	/**
	 * This function will make the request to the data receivers only if the data captured is not a card number.
	 * If the value is supposed to be an email, the callToSendDataReceivers will get called only if it is one.
	 * @memberof CapturedFormMapping
	 * @param {Object} formMapping - The description of the data captured.
	 * @param {String} data - The data that has been captured.
	 * @param {Number} seriesNumber - The number of the data captured in case it is in a RawSerie type.
	 */
	CapturedFormMapping.prototype.doRequest = function (formMapping, data, seriesNumber) {
		var currentParameters = null,
			requestDetails = 'DataReceiver request for FormMapping: ' + formMapping.FormMappingId;

		if (data && !Utils.string.isCreditCard(data)) {
			if(!formMapping.isEmail || (formMapping.isEmail && Utils.string.isValidEmail(data))){
				Utils.shell.log('Captured formMapping: ' + formMapping.FormMappingId + ' - data captured: ' + data);
				currentParameters = this.getParameters(formMapping, data, seriesNumber);
				this.callToSendDataReceivers(this.pathForRequest, currentParameters, requestDetails);
			}
		}
	};

	/**
	 * This function is changing the stored data if present in the array.
	 * If data was already stored and equal to the one we captured, we do not store it again.
	 * @memberof CapturedFormMapping
	 * @param {Number} id - The id of the data we stored.
	 * @param {String} data - The data that has been captured.
	 * @param {Number} seriesNumber - The number of the data captured in case it is in a RawSerie type.
	 * @return {Object} The object returned specifes if the value was present in the array and if we changed it or not.
	 */
	CapturedFormMapping.prototype.changeData = function (id, data, seriesNumber) {
		var isValueInArray = false,
			valueChanged = false;

		for (var i = this.data.length - 1; i >= 0; i--) {
			if(this.data[i].fieldId === id && this.data[i].series === seriesNumber){
				isValueInArray = true;

				if(this.data[i].fieldValue !== data){
					valueChanged = true;
					this.data[i].fieldValue = data;
				}
				break;
			}
		}

		return {
			isValueInArray: isValueInArray,
			valueChanged: valueChanged
		};
	};

	/**
	 * This function is calling the changeData one and based on the result, adds a new entry to the data property.
	 * @memberof CapturedFormMapping
	 * @param {Number} id - The id of the data we stored.
	 * @param {String} data - The data that has been captured.
	 * @param {Number} seriesNumber - The number of the data captured in case it is in a RawSerie type.
	 * @return {Boolean} The value returned specifyes if the value changed or not. If false, the value was already in the data array and was equal to the on passed as parameter, returns true otherwise.
	 */
	CapturedFormMapping.prototype.storeData = function (id, data, seriesNumber) {
		var changeData;

		seriesNumber = seriesNumber ? seriesNumber : 1;
		changeData = this.changeData(id, data, seriesNumber);

		if(!changeData.isValueInArray){
			changeData.valueChanged = true;
			this.data.push({
				'fieldId': id,
				'fieldValue': data,
				'series': seriesNumber
			});
		}

		return changeData.valueChanged;
	};

	/**
	 * This function calls the callForChangeData only if the data has changed and call the doRequests method.
	 * @memberof CapturedFormMapping
	 * @param {Object} formMapping - The description of the data captured.
	 * @param {String} data - The data that has been captured.
	 * @param {Number} seriesNumber - The number of the data captured in case it is in a RawSerie type.
	 */
	CapturedFormMapping.prototype.processData = function(formMapping, data, seriesNumber) {
		//TODO: change this structure for an object[formMappingID][seriesNumber] for a way more efficient approach
		if(this.storeData(formMapping.FormMappingId, data, seriesNumber)){
			this.callForChangedData(this.data);
		}

		this.doRequest(formMapping, data, seriesNumber);
	};

	/**
	 * This function calls the processData function for each value we captured.
	 * @memberof CapturedFormMapping
	 * @param {Object} formMapping - The description of the data captured.
	 * @param {String} data - The data that has been captured.
	 */
	CapturedFormMapping.prototype.processRawSeriesData = function(formMapping, capturedData) {
		var i = 0;
		for (; i < capturedData.length; i++) {
			this.processData(formMapping, capturedData[i], i + 1);
		}
	};

	/**
	 * This function calls either the processData function either the processRawSeriesData one depend on the FieldTypeName.
	 * @memberof CapturedFormMapping
	 * @param {Object} formMapping - The description of the data captured.
	 * @param {String} data - The data that has been captured.
	 */
	CapturedFormMapping.prototype.sendData = function(formMapping, capturedData) {
		if(formMapping.FieldTypeName !== 'RawSeries'){
			this.processData(formMapping, capturedData[0], 1);
		} else {
			this.processRawSeriesData(formMapping, capturedData);
		}
	};

	/**
	 * Returns the data captured for the current page
	 * @return {Array} The captured data array
	 */
	CapturedFormMapping.prototype.getData = function() {
		return this.data;
	};

	classes.CapturedFormMapping = CapturedFormMapping;

}(window, classes, Utils));
