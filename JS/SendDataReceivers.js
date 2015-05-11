/*eslint strict:0*/
(function(win, classes, Utils){
	'use strict';

	var ONE_BILLION = 1000000000;
	/*
	 * This class set the default parameters to send the requests to the data receivers + do the requests by calling the ApiManager of the data receivers
	 * @class SendDataReceivers
	 * @param {Function} callToMakeRequest - call to the ApiManager instance of the dataReceivers
	 */
	function SendDataReceivers(callToMakeRequest) {
		this.callToMakeRequest = callToMakeRequest;

        this.requestCount = 1;
		this.instanceId = (Utils.date.now().toString() + win.Math.floor(win.Math.random() * ONE_BILLION)).substring(0, 20); //should give a 22 character string, which we trim down
	}

	/*
	 * This function sets all the default parameters of all requests
	 * @memberof SendDataReceivers
	 * @param {String} parameters - The requests parameters
	 * @return {Object} Returns the requests parameters + the default ones that have been added
	 */
	SendDataReceivers.prototype.setDefaultParameters = function (parameters) {
		parameters.pageId = this.instanceId;
		parameters.requestId = this.instanceId + '_' + this.requestCount;
		parameters.jsonCallback = 'VeAPI.JSONP.callbacks.VEjQuery' + this.instanceId + '_' + this.requestCount;
		parameters.referrer = Utils.domain.createUrl('', '', parameters);

		this.requestCount = this.requestCount + 1;

		return parameters;
	};

	/*
	 * This function calls the ApiManager instance of the data receivers to make the request
	 * @memberof SendDataReceivers
	 * @param {Array} requestPath - path given for the request's URL
	 * @param {Object} parameters - Requests parameters
	 * @param {String} requestDetails - details of the request
	 */
	SendDataReceivers.prototype.request = function (requestPath, parameters, requestDetails) {
		parameters = this.setDefaultParameters(parameters);
		this.callToMakeRequest(requestPath, {}, null, null, requestDetails, parameters);
	};

	classes.SendDataReceivers = SendDataReceivers;
}(window, classes, Utils));
