define([
], function() {

	var instance;

	function NativeObjects(iframeId){
		this.iframeId = iframeId;
		this.iframe = null;
	}

	NativeObjects.prototype.getNativeObject = function(objectPath) {
		var path = objectPath.split('.'),
			objectToReturn,
			pathLength,
			i = 0;

		if(path[0] === 'window'){
			path = path.slice(1);
		}

		pathLength = path.length;
		objectToReturn = this.iframe.contentWindow;
		for (; i < pathLength; i = i + 1) {
			objectToReturn = objectToReturn[path[i]];
		};

		return objectToReturn;
	};

	NativeObjects.prototype.createIframe = function() {
		this.iframe = document.createElement('iframe');
		
		this.iframe.id = this.iframeId;
		this.iframe.style.display = 'none';
		document.body.appendChild(this.iframe);

		return this.iframe;
	};

	NativeObjects.prototype.init = function() {
		this.createIframe();
	};

	NativeObjects.getInstance = function(){
		if(!instance){
			instance = new NativeObjects('SDK-native-objects');
			instance.init();
		}
		return instance;
	};

	return NativeObjects.getInstance();
});
