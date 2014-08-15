var mejorua = mejorua || {};
(function() {
    mejorua.Map = function Map() {

        /****************************************************************************************************************

            ATRIBUTES

        ****************************************************************************************************************/
        var self = this;
        this.map = undefined; //Leafleat Map
        this.geoJSON = undefined; //GeoJSON to display
        this.newIssueMarker = undefined;

        this.pathToImages = 'img/map/';


        this.mapId = 'map';


        this.latitude = 38.383572; // Leaflet map default latitude - Set to University of Alicante
        this.longitude = -0.512019; // Leaflet map default longitude - Set to University of Alicante
        this.zoom = 16; // Leaflet map zoom level - Level 16 in University of Alicante works like a charm in my laptop

        this.tileOSMURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        this.attributionOSM = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors';

        this.stateCSS = {
            PENDING: 'issueStatePending',
            INPROGRESS: 'issueStateInProgress',
            DONE: 'issueStateDone'
        }
        this.stateText = {
            PENDING: "Pendiente",
            INPROGRESS: "En proceso",
            DONE: "Hecho"
        }

        //Icon associated with a state. INITIALIZED AT initIcon()
        this.stateIcon = undefined;

        /****************************************************************************************************************

            METHODS

        ****************************************************************************************************************/

        this.init = function init() {
            console.log("mejorua.Map.init()");

            _.bindAll(this, "addGeoJSONpointToLayer");
            _.bindAll(this, "addGeoJSONonEachFeature");
            _.bindAll(this, "onModelUpdated");

            //Init Leaflet Map
            this.map = L.map(this.mapId).setView([this.latitude, this.longitude], this.zoom);
            this.map.on('click', this.addDraggableMarker);

            //Load OSM map tiles + attribution
            L.tileLayer(this.tileOSMURL, {
                attribution: this.attributionOSM
            }).addTo(this.map);

            this.initIcons();

            $(this).on('modelUpdated', this.onModelUpdated);

            //this.DEBUGpopulateLocations();
            //this.DEBUGpopulateMarkers();
        };

        this.initIcons = function initIcon() {
            //22 62
            iconSize = [22, 31];
            iconAnchor = [(iconSize[0] / 2), iconSize[1]];
            popupAnchor = [0, -iconSize[1]];

            this.iconDone = L.icon({
                iconUrl: this.pathToImages + 'icon_done.png',
                shadowUrl: this.pathToImages + 'marker-shadow.png',
                iconAnchor: iconAnchor,
                popupAnchor: popupAnchor,
                iconSize: iconSize
            });
            this.iconInProgress = L.icon({
                iconUrl: this.pathToImages + 'icon_inProgress.png',
                shadowUrl: this.pathToImages + 'marker-shadow.png',
                iconAnchor: iconAnchor,
                popupAnchor: popupAnchor,
                iconSize: iconSize
            });
            this.iconPending = L.icon({
                iconUrl: this.pathToImages + 'icon_pending.png',
                shadowUrl: this.pathToImages + 'marker-shadow.png',
                iconAnchor: iconAnchor,
                popupAnchor: popupAnchor,
                iconSize: iconSize
            });

            this.stateIcon = {
                PENDING: this.iconPending,
                INPROGRESS: this.iconInProgress,
                DONE: this.iconDone
            }
        }

        this.addGeoJSON = function addGeoJSON(geoJSON) {
            console.log("mejorua.Map.addGeoJSON(geoJSON:%O)", geoJSON);

            L.geoJson(geoJSON, {
                pointToLayer: this.addGeoJSONpointToLayer,
                onEachFeature: this.addGeoJSONonEachFeature
            }).addTo(this.map);
        }

        this.addGeoJSONpointToLayer = function addGeoJSONpointToLayer(feature, latlng) {
            var icon = "";
            icon = this.stateIcon[feature.properties.state];
            return L.marker(latlng, {
                icon: icon
            });
        }

        this.addGeoJSONonEachFeature = function addGeoJSONonEachFeature(feature, layer) {
            if (feature.properties) {
                popupText = '<p>' +
                    this.stateText[feature.properties.state] + '<br/>' +
                    feature.properties.action + '<br/>' +
                    feature.properties.term + '<br/>' +
                    '<a href="javascript:mejorua.app.onShowIssueDetail(' + feature.properties.id + ')" class="btn btn-xs btn-primary">Ver detalles</a>' +
                    '</p>';
                layer.bindPopup(popupText, {
                    className: this.stateCSS[feature.properties.state]
                });
            }
        }

        //http://stackoverflow.com/questions/18575722/leaflet-js-set-marker-on-click-update-postion-on-drag
        this.addDraggableMarker = function addDraggableMarker(e) {
            console.log("mejorua.Map.addDraggableMarker(e:%O)", e);

            self.newIssueMarker = new L.marker(e.latlng, {
                id: 'newIssueMarker',
                icon: self.iconPending,
                draggable: 'true'
            });
            //self.newIssueMarker.on('dragend', self.onMarkerDragEnd);
            self.map.addLayer(self.newIssueMarker);
        };

        /****************************************************************************************************************

            EVENTS

        ****************************************************************************************************************/

        this.onModelUpdated = function onModelUpdated(event, geoJSON) {
            console.log("mejorua.Map.onModelUpdated(geoJSON:%O)", geoJSON);

            this.addGeoJSON(geoJSON);
        }

        this.onLoadStateNewIssue = function onNewIssueMarkerClick() {
            alert("Lets put a new issue");
        }

        /*
        this.onMarkerDragEnd = function onMarkerDragEnd(e) {
            console.log("mejorua.Map.newIssueMarker:dragend(event:%O)", e);
                var marker = e.target;
                var position = marker.getLatLng();
                marker.setLatLng([position], {
                    id: marker.options.id,
                    draggable: 'true'
                }).bindPopup(position).update();
        }
        */

        /****************************************************************************************************************

            DEBUG

        ****************************************************************************************************************/

        this.DEBUGpopulateLocations = function DEBUGpopulateLocations() {
            console.log("mejorua.Map.DEBUGpopulateLocations()");

            //UA: 38.383572, -0.512019
            //Torrevieja Glorieta: 37.977483, -0.682846

            this.locations = [];

            this.locations.aulario2 = {
                topLeft: {
                    latitude: 38.385056,
                    longitude: -0.511123
                },
                topRight: {
                    latitude: 38.385065,
                    longitude: -0.509975
                },
                bottomLeft: {
                    latitude: 38.383643,
                    longitude: -0.511096
                },
                bottomRight: {
                    latitude: 38.383681,
                    longitude: -0.509830
                },
                latitude: 38.384488,
                longitude: -0.510120
            };
            this.locations.bibliotecaGeneral = {
                latitude: 38.383235,
                longitude: -0.512158
            };
            this.locations.eps1 = {
                latitude: 38.386755,
                longitude: -0.511295
            };
        }

        this.DEBUGpopulateMarkers = function DEBUGpopulateMarkers() {
            console.log("mejorua.Map.DEBUGpopulateMarkers()");

            feature = this.DEBUGnewFeature('aulario2', 'pending');
            this.addGeoJSON(feature);

            feature = this.DEBUGnewFeature('bibliotecaGeneral', 'done');
            this.addGeoJSON(feature);

            feature = this.DEBUGnewFeature('eps1', 'inProgress');
            this.addGeoJSON(feature);

            //var marker = L.marker([this.locations['aulario2'].latitude, this.locations['aulario2'].longitude], {icon: this.icon}).addTo(this.map);
        }

        this.DEBUGnewFeature = function DEBUGnewFeature(locationName, state) {
            var geojsonFeature = {
                "type": "Feature",
                "properties": {
                    "state": state,
                    "action": "Action",
                    "term": "Term"
                },
                "geometry": {
                    "type": "Point",
                    //"coordinates": [this.locations[locationName].latitude, this.locations[locationName].longitude]
                    "coordinates": [this.locations[locationName].longitude, this.locations[locationName].latitude]
                }
            };
            return geojsonFeature;
        }

        /****************************************************************************************************************

            AUTOINITIALIZATION (SIMILAR TO CONSTRUCTOR CALL ON NEW Map CLASS OBJECT)

        ****************************************************************************************************************/

        this.init();
    };
})();