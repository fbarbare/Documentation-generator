/*eslint eqeqeq:0,strict:0*/
(function (classes, Utils) {
	'use strict';

	/*
	 * The FormChangeStatus sends a requests to the dataReceiversChangeStatus if a form type 2 or 9 has been identified
	 * @class FormChangeStatus
	 * @param {Function} callToSendDataReceivers - function to call in order to send the request
	 * @param {Array} pathForRequest - Array defining the path of the URL for the request
	 * @param {String} journeyCode - Journey code of the customer
	 */
	function FormChangeStatus(callToSendDataReceivers, pathForRequest, journeyCode) {
		this.callToSendDataReceivers = callToSendDataReceivers;
		this.pathForRequest = pathForRequest;
		this.journeyCode = journeyCode;
	}

	/*
	 * This function prepare the request to the data receivers + calls the callToSendDataReceivers function in kjorder to do the request
	 * @memberof FormChangeStatus
	 * @param {Number} formStatus - The satus of the identified form
	 * @param {Number} formTypeId - The type of the identified form
	 */
	FormChangeStatus.prototype.doRequest = function (formStatus, formTypeId) {
		var requestDetails = 'Change Status request as form type ' + formTypeId + ' indentified -> form status: ' + formStatus,
			parameters = {
			journeyCode: this.journeyCode,
			status: formStatus
		};

		Utils.shell.info(requestDetails);
		this.callToSendDataReceivers(this.pathForRequest, parameters, requestDetails);
	};

	/*
	 * This function checks if the identified form requires a request to the data receivers
	 * @memberof FormChangeStatus
	 * @param {String} formTypeId - The type of the identified form
	 */
	FormChangeStatus.prototype.checkForm = function (formTypeId) {
		var formStatus = 0;

		formTypeId = formTypeId.toString(); // server expects string.
		if (formTypeId === '2') {
			formStatus = 1;
		}
		if (formTypeId === '3') {
			formStatus = 9;
		}

		if (formStatus !== 0) {
			this.doRequest(formStatus, formTypeId);
		}
	};

	classes.FormChangeStatus = FormChangeStatus;
}(classes, Utils));
