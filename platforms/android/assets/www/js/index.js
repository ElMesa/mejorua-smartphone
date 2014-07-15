MejorUAFactory = function MejorUAFactory() {

	this.Api = function Api() {
		
		this.init = function init() {
			
			this.protocol = "http";
			this.host = "10.0.2.2";
			this.port = "8080";
			this.path = "api";
			this.collection = "incidencia";
			this.resourceId = "1";
			this.resourceURL = this.buildResourceURL();
			
			this.updateView();
		}

		this.setHost = function setHost(host) {
			console.log("mejorua.api.setHost(host: %s)", host);

			this.host = host;
			this.updateView();
		};
		
		this.buildResourceURL = function buildResourceURL() {
			console.log("mejorua.api.buildResourceURL()");

			this.resourceURL = this.protocol + "://" + this.host + ":" + this.port + "/" + this.path + "/" + this.collection + "/";
			if(this.resourceId) this.resourceURL += this.resourceId;
			
			return this.resourceURL;
		}
		
		this.updateModel = function updateModel() {
			console.log("mejorua.api.updateModel()");

			this.protocol = "http";
			this.host = $("#apiHost").val();
			this.port = $("#apiPort").val();
			this.path = $("#apiPath").val();
			this.collection = $("#collection").val();
			this.resourceId = $("#fGet_resourceId").val();
			this.buildResourceURL();
		}
		
		this.updateView = function updateView() {
			console.log("mejorua.api.updateView()");

			$("#apiHost").val(this.host);
			$("#apiPort").val(this.port);
			$("#apiPath").val(this.path);
			$("#collection").val(this.collection);
			$("#fGet_resourceId").val(this.resourceId);
			
		}
		
		this.init();
	};

	this.init = function init() {
		
		this.api = new this.Api;

		_.bindAll(this, "getIncidencia");
		_.bindAll(this, "onGetIncidenciaResponse");

		_.bindAll(this, "putIncidencia");
		_.bindAll(this, "onPutIncidenciaResponse");

		_.bindAll(this, "onBtn_setHostLocalhostClick");
		_.bindAll(this, "onBtn_setHostAndroidEmulatorHostClick");

		$("#fGet_submit").click(this.getIncidencia);
		$("#fPut_submit").click(this.putIncidencia);

		$("#btn_setHostLocalhost").click(this.onBtn_setHostLocalhostClick);
		$("#btn_setHostAndroidEmulatorHost").click(this.onBtn_setHostAndroidEmulatorHostClick);

	}

	this.getIncidencia = function getIncidencia() {
		console.log("mejorua.getIncidencia()");

		this.api.updateModel();
		var resourceUrl = this.api.buildResourceURL();

		$.ajax({
			url : resourceUrl,
			type : "GET",
			dataType : 'json',
		// success : this.onGetIncidenciaResponse,
		// error : this.onAjaxError
		}).done(this.onGetIncidenciaResponse).fail(this.onAjaxError);
	}

	this.onGetIncidenciaResponse = function onGetIncidenciaResponse(data, status, xhr) {
		console.log("mejorua.onGetIncidenciaResponse(data %O, status %O, xhr %O)", data, status, xhr);

		$("#fGet_response").html(xhr.responseText);

		// $("#fPut_resourceId").val(data.id)
	}

	this.putIncidencia = function putIncidencia() {
		console.log("mejorua.putIncidencia()");
		
		var incidencia = {};
		incidencia.id = $("#fPut_resourceId").val();
		incidencia.latitud = $("#fPut_latitude").val();
		incidencia.longitud = $("#fPut_longitude").val();
		incidencia.termino = $("#fPut_term").val();
		incidencia.accion = $("#fPut_action").val();
		
		this.api.updateModel();
		
		var resourceUrl = this.api.buildResourceURL();
		var JSONdata = JSON.stringify(incidencia);
		$.ajax({
			url : resourceUrl,
			type : "PUT",
			// dataType: 'application/json',
			dataType : 'json',
			contentType : 'application/json; charset=UTF-8',
			data : JSONdata
		}).done(this.onPutIncidenciaResponse).fail(this.onAjaxError);

	}

	this.onPutIncidenciaResponse = function onPutIncidenciaResponse(data, status, xhr) {
		console.log("mejorua.onPutIncidenciaResponse(data %O, status %O, xhr %O)", data, status, xhr);

		$("#fPut_response").html(xhr.responseText);
	}

	this.onAjaxError = function onAjaxError(xhr, status, error) {
		console.log("mejorua.onAjaxError(xhr %O, status %O, error %O)", xhr, status, error);
	}

	this.onBtn_setHostLocalhostClick = function onBtn_setHostLocalhostClick() {
		console.log("mejorua.onBtn_setHostLocalhostClick()");

		this.api.setHost("localhost");
	}

	this.onBtn_setHostAndroidEmulatorHostClick = function onBtn_setHostAndroidEmulatorHostClick() {
		console.log("mejorua.onBtn_setHostAndroidEmulatorHostClick()");

		this.api.setHost("10.0.2.2");
	}

}

$(document).ready(function() {

	mejorua = new MejorUAFactory();

	mejorua.init();
	
	testPUT();
	testPOST();
});

function testPUT() {
	
	xmlhttp=new XMLHttpRequest();
	
	xmlhttp.open("PUT","http://localhost:8080/api/incidencia/1",false);
	//xmlhttp.setRequestHeader("Accept","application/json; charset=UTF-8");
	//xmlhttp.setRequestHeader("Content-Type","application/json; charset=UTF-8");
	xmlhttp.setRequestHeader("Content-Type","multipart/form-data");
	xmlhttp.send('{"id":"1","latitud":"2","longitud":"2","termino":"xmlhttp testPUT","accion":"xmlhttp testPUT"}');
	
	xmlhttp.open("GET","http://localhost:8080/api/incidencia/1",false);
	xmlhttp.send();
	console.log("testPUT() - RESPONSE: ", xmlhttp.responseText);
};

function testPOST() {
	
	xmlhttp=new XMLHttpRequest();
	
	xmlhttp.open("POST","http://localhost:8080/api/incidencia/1",false);
	//xmlhttp.setRequestHeader("Accept","application/json; charset=UTF-8");
	xmlhttp.setRequestHeader("Content-Type","application/json; charset=UTF-8");
	xmlhttp.send('{"id":"1","latitud":"2","longitud":"2","termino":"xmlhttp testPOST","accion":"xmlhttp testPOST"}');
	
	xmlhttp.open("GET","http://localhost:8080/api/incidencia/1",false);
	xmlhttp.send();
	console.log("testPUT() - RESPONSE: ", xmlhttp.responseText);
};