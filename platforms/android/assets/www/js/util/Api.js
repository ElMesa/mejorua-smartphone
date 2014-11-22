var mejorua = mejorua || {};

(function (){
	mejorua.Api = function Api() {
		
		this.init = function init() {
		
			this.protocol = window.location.protocol;
			this.hostname = window.location.hostname; //this.hostname = "10.0.2.2";
			this.port = window.location.port;
			this.pathName = window.location.pathname;
			this.pathNameAPI = "api";

			this.collection = "issues";
			this.resourceId = "1";

			//Derived parameters
			this.url = this.buildURL();
			this.resourceURL = this.buildResourceURL();
			
			this.updateView();
		}
		
		this.initPhonegap = function initPhonegap() {
			
			this.protocol = 'http:';
			this.hostname = "10.0.2.2";
			this.port = '8080';
			this.pathName = '/mejorua-api/';
			this.pathNameAPI = "api";

			this.collection = "issues";
			this.resourceId = "1";

			//Derived parameters
			this.url = this.buildURL();
			this.resourceURL = this.buildResourceURL();
			
			this.updateView();
		}
		
		this.initCustomHost = function initCustomHost() {
			
			this.protocol = 'http:';
			this.hostname = $('#RESTClient_customHost').val();
			this.port = '8080';
			this.pathName = '/mejorua-api/';
			this.pathNameAPI = "api";

			this.collection = "issues";
			this.resourceId = "1";

			//Derived parameters
			this.url = this.buildURL();
			this.resourceURL = this.buildResourceURL();
			
			this.updateView();
		}

		this.buildURL = function buildURL() {
			console.log("mejorua.api.buildURL()");
			this.url = this.protocol + "//" + this.hostname + ":" + this.port + this.pathName + this.pathNameAPI;
		};

		this.setHost = function setHost(hostname) {
			console.log("mejorua.api.setHost(host: %s)", hostname);

			this.hostname = hostname;
			this.buildURL();
			this.buildResourceURL();
			this.updateView();
		};
		
		this.buildResourceURL = function buildResourceURL() {
			console.log("mejorua.api.buildResourceURL()");

			this.buildURL();
			this.resourceURL = this.url + "/" + this.collection + "/";
			if(this.resourceId) this.resourceURL += this.resourceId;
			
			return this.resourceURL;
		}
		
		this.updateModel = function updateModel() {
			console.log("mejorua.api.updateModel()");

			this.hostname = $("#apiHost").val();
			this.port = $("#apiPort").val();
			this.path = $("#apiPath").val();
			this.collection = $("#collection").val();
			this.resourceId = $("#fGet_resourceId").val();
			this.buildResourceURL();
		}
		
		this.updateView = function updateView() {
			console.log("mejorua.api.updateView()");

			$("#apiHost").val(this.hostname);
			$("#apiPort").val(this.port);
			$("#apiPath").val(this.pathName);
			$("#collection").val(this.collection);
			$("#fGet_resourceId").val(this.resourceId);
			
		}
		
		this.init();
	};
})();
