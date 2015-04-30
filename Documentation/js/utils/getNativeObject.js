define([
	'namespace'
], function(namespace) {

	var instance;

	namespace.NativeObjects = function () {
		this.iframeId = new Date().getTime();
		this.iframe = document.getElementById(this.iframeId);
		
		if (!this.iframe) {
			this.iframe = document.createElement('iframe');
			
			this.iframe.id = this.iframeId;
			this.iframe.style.display = 'none';
			document.body.appendChild(this.iframe);
		}
	};

	namespace.NativeObjects.prototype.getNativeObject = function(objectPath) {
		var path = objectPath.split('.'),
			objectToReturn,
			pathLength,
			i = 0;

		if(path[0] === 'window'){
			path = path.slice(1);
		}

		pathLength = path.length;
		objectToReturn = instance.iframe.contentWindow;
		for (; i < pathLength; i = i + 1) {
			objectToReturn = objectToReturn[path[i]];
		};

		return objectToReturn;
	};

	namespace.NativeObjects.getInstance = function() {
		if (!instance) {
			instance = new namespace.NativeObjects();
		}
		return instance;
	};

	return namespace.NativeObjects.getInstance().getNativeObject;
});
