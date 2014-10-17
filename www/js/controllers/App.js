var mejorua = mejorua || {};
mejorua.controllers = mejorua.controllers || {};

(function() {
    mejorua.controllers.App = function App() {

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        ///	ATRIBUTTES
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        var self = this;
        this.models = {};
        this.views = {};
        this.controllers = {};

        this.page = undefined;
        this.api = undefined;
        this.map = undefined;

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        ///	METHODS
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.init = function init() {
            console.log("controllers.App.init()");
  
            this.api = new mejorua.Api();
            this.map = new mejorua.Map();
            this.page = new mejorua.controllers.Page();
    
            this.views.issueDetail = new mejorua.views.IssueDetail();
            this.controllers.issueDetail = new mejorua.controllers.IssueDetail();

            this.setupPages();
            this.page.init();

            // Backbone Collection - Issues
            this.models.issues = new mejorua.models.IssueCollection(
                [], {
                    apiURL: this.api.url,
                    map: this.map
                }
            );
            var issuesFetchedPromise = this.models.issues.myFetch();
            issuesFetchedPromise.done(function() { 
                self.controllers.issueDetail.init(self.models.issues, self.views.issueDetail);
            });

            //this.DEBUGMap();
            //this.DEBUGIssueCollection();
            //this.DEBUGIssueModel(this.api.url);
            //_.bindAll(this, "DEBUGIssueDetail");
            //fetchPromise.done(this.DEBUGIssueDetail);

            //TODO - REFACTOR - to controller.restClient or view.restClient
            /////////////////////////////////////////////////////////////////////////
            //Page API REST Client
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
            //Page API REST Client - END
            ///////////////////////////////////////////////////////////////////////////

        }

        this.setupPages = function setupPages() {
            var pageMap = {
                id: "pageMap",
                state: {
                    default: {
                        id: 'default',
                        title: "Mejor UA - Mapa",
                        url: "mapa"
                    },
                    newIssue: {
                        id: 'newIssue',
                        title: "Mejor UA - Mapa - Notificar incidencia",
                        url: "mapa/notificarIncidencia",
                        onLoad: this.map.onLoadStateNewIssue
                    }
                }
            }
            pageMap.actualState = pageMap.state['default'];

            var pageIssueDetail = {
                id: "pageIssueDetail",
                state: {
                    default: {
                        id: 'default',
                        title: "Mejor UA - Detalles incidencia",
                        url: "detallesIncidencia",
                        onLoad: this.controllers.issueDetail.onLoadStateDefault
                    }
                }
            }
            pageIssueDetail.actualState = pageIssueDetail.state['default'];

            var pageRESTClient = {
                id: "pageRESTClient",
                state: {
                    default: {
                        id: 'default',
                        title: "Mejor UA - Cliente REST",
                        url: "clienteREST"
                    }
                }
            }
            pageRESTClient.actualState = pageRESTClient.state['default'];

            this.page.add(pageMap);
            this.page.add(pageIssueDetail);
            this.page.add(pageRESTClient);
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        /// EVENTS
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        this.onNewIssueMarkerClick = function onNewIssueMarker() {
            self.page.show('pageMap');
            self.map.onNewIssueMarkerClick();
        }

        //TODO - REFACTOR - Create controller.IssueDetail and add onLoadStateDefault there instead of in the view
        this.onShowIssueDetail = function onShowIssueDetail(id) {

        	this.views.issueDetail.update(this.models.issues.get(id).attributes);

        	//TODO - Use refactor and use this.page.showIssueDetail()
        	pageShowIssueDetail();
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        ///	//TODO - REFACTOR - controller.RestClient
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.getIncidencia = function getIncidencia() {
            console.log("mejorua.getIncidencia()");

            $("#fGet_response").html("Waiting response.");

            this.api.updateModel();
            var resourceUrl = this.api.buildResourceURL();

            $.ajax({
                url: resourceUrl,
                type: "GET",
                dataType: 'json',
            }).done(this.onGetIncidenciaResponse).fail(this.onAjaxError);
        }

        this.onGetIncidenciaResponse = function onGetIncidenciaResponse(data, status, xhr) {
            console.log("mejorua.onGetIncidenciaResponse(data %O, status %O, xhr %O)", data, status, xhr);

            stepToJSONPrettyPrint = JSON.parse(xhr.responseText);
            JSONprettyPrint = JSON.stringify(stepToJSONPrettyPrint, undefined, 2);

            $("#fGet_response").html(JSONprettyPrint);
        }

        this.putIncidencia = function putIncidencia() {
            console.log("mejorua.putIncidencia()");

            $("#fPut_response").html("Waiting response.");

            var issue = {};
            issue.id = $("#fPut_resourceId").val();
            issue.latitude = $("#fPut_latitude").val();
            issue.longitude = $("#fPut_longitude").val();
            issue.term = $("#fPut_term").val();
            issue.action = $("#fPut_action").val();

            this.api.updateModel();

            var resourceUrl = this.api.buildResourceURL();
            var JSONdata = JSON.stringify(issue);
            $.ajax({
                url: resourceUrl,
                type: "POST",
                contentType: 'application/json; charset=UTF-8',
                data: JSONdata,
            }).done(this.onPutIncidenciaResponse).fail(this.onAjaxError);

        }

        this.onPutIncidenciaResponse = function onPutIncidenciaResponse(data, status, xhr) {
            console.log("mejorua.onPutIncidenciaResponse(data %O, status %O, xhr %O)", data, status, xhr);

            $("#fPut_response").html(xhr.status + " " + xhr.statusText + ":" + xhr.responseText);
        }

        this.onBtn_setHostLocalhostClick = function onBtn_setHostLocalhostClick() {
            console.log("mejorua.onBtn_setHostLocalhostClick()");

            this.api.setHost("localhost");
        }

        this.onBtn_setHostAndroidEmulatorHostClick = function onBtn_setHostAndroidEmulatorHostClick() {
            console.log("mejorua.onBtn_setHostAndroidEmulatorHostClick()");

            this.api.setHost("10.0.2.2");
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        ///	//TODO - REFACTOR - controller.Api
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.onAjaxError = function onAjaxError(xhr, status, error) {
            console.log("mejorua.onAjaxError(xhr %O, status %O, error %O)", xhr, status, error);
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        ///	DEBUG
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        this.DEBUGIssueCollection = function DEBUGIssueCollection() {
            console.log("controllers.App.DEBUGIssueCollection()");

            console.log("controllers.App.DEBUGIssueCollection() models.issues.url() = " + this.models.issues.url);

            this.models.issues.fetch({
                this: this,
                success: function(collection, response, options) {
                    console.log("controllers.App.DEBUGIssueCollection() models.issues.models = %O", options.this.models.issues.models);
                },
                error: function() {
                    console.log("controllers.App.DEBUGIssueCollection() models.issues.fetch ERROR");
                }
            });
        }

        this.DEBUGIssueModel = function DEBUGIssueModel(url) {
            console.log("controllers.App.DEBUGIssueModel()");

            this.models.DEBUGissue = new mejorua.models.Issue();
            this.models.DEBUGissue.set({
                id: 1
            });
            this.models.DEBUGissue.urlRoot = url + '/issues';
            console.log("controllers.App.DEBUGIssueModel() DEBUGissue.url() = " + this.models.DEBUGissue.url());

            deferred = this.models.DEBUGissue.fetch({
                this: this
            });
            deferred.then(
                function success(collection, response, options) {
                    console.log("controllers.App.DEBUGIssueModel() DEBUGissue.fetch() = %O", this.this.models.DEBUGissue);
                },
                function error() {
                    console.log("controllers.App.DEBUGIssueModel() DEBUGissue.fetch() ERROR");
                });
        }

        this.DEBUGMap = function DEBUGMap() {
            console.log("controllers.App.DEBUGMap()");

            MB_ATTR = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="http://mapbox.com">Mapbox</a>';

            MB_URL = 'http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';

            OSM_URL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            OSM_ATTRIB = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors';

            this.map = L.map('map').setView([51.505, -0.09], 13);

            L.tileLayer(MB_URL, {
                attribution: MB_ATTR,
                id: 'examples.map-i86knfo3'
            }).addTo(map);

            L.tileLayer('http://{s}.tiles.mapbox.com/v3/MapID/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 18
            }).addTo(this.map);

            L.marker([51.5, -0.09]).addTo(this.map);
        }

        this.DEBUGIssueDetail = function DEBUGIssueDetail() {

            this.views.issueDetail.update(this.models.issues.models[0].attributes);
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        ///	SELF INITILIZATION
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        this.init();
    }
})();