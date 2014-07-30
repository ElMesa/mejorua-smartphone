var mejorua = mejorua || {};
(function() {
    mejorua.Map = function Map() {

        /****************************************************************************************************************

            ATRIBUTES

        ****************************************************************************************************************/

        this.map = undefined; //Leafleat Map
        this.geoJSON = undefined; //GeoJSON to display

        this.pathToImages = 'img/map/';

        
        this.mapId = 'map';

        
        this.latitude = 38.383572; // Leaflet map default latitude - Set to University of Alicante
        this.longitude = -0.512019; // Leaflet map default longitude - Set to University of Alicante
        this.zoom = 16; // Leaflet map zoom level - Level 16 in University of Alicante works like a charm in my laptop

        this.tileOSMURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        this.attributionOSM = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors';

        this.statusText = {
            done : "Hecho",
            inProgress: "En proceso",
            pending : "Pendiente"
        }

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
            iconAnchor = [(iconSize[0]/2), iconSize[1]];
            popupAnchor = [0, -iconSize[1]];

            this.iconDone = L.icon({
                iconUrl: this.pathToImages + 'icon_done.png',
                shadowUrl: this.pathToImages + 'marker-shadow.png',
                iconAnchor:   iconAnchor,
                popupAnchor:  popupAnchor,
                iconSize:     iconSize
            });
            this.iconInProgress = L.icon({
                iconUrl: this.pathToImages + 'icon_inProgress.png',
                shadowUrl: this.pathToImages + 'marker-shadow.png',
                iconAnchor:   iconAnchor,
                popupAnchor:  popupAnchor,
                iconSize:     iconSize
            });
            this.iconPending = L.icon({
                iconUrl: this.pathToImages + 'icon_pending.png',
                shadowUrl: this.pathToImages + 'marker-shadow.png',
                iconAnchor:   iconAnchor,
                popupAnchor:  popupAnchor,
                iconSize:     iconSize
            });
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

            switch (feature.properties.status) {
                case 'pending': icon = this.iconPending; break;
                case 'inProgress': icon = this.iconInProgress; break;
                case 'done': icon = this.iconDone; break;
            }
    
            return L.marker(latlng, {icon: icon});
        }

        this.addGeoJSONonEachFeature = function addGeoJSONonEachFeature(feature, layer) {
            if (feature.properties) {
                popupText = this.statusText[feature.properties.status] + "<br/>" +
                            feature.properties.action + "<br/>" +
                            feature.properties.term;
                layer.bindPopup(popupText);
            }
        }

        /****************************************************************************************************************

            EVENTS

        ****************************************************************************************************************/

        this.onModelUpdated = function onModelUpdated(event, geoJSON) {
            console.log("mejorua.Map.onModelUpdated(geoJSON:%O)", geoJSON);

            this.addGeoJSON(geoJSON);
        }

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

            feature = this.DEBUGnewFeature('eps1','inProgress');
            this.addGeoJSON(feature);

            //var marker = L.marker([this.locations['aulario2'].latitude, this.locations['aulario2'].longitude], {icon: this.icon}).addTo(this.map);
        }

        this.DEBUGnewFeature = function DEBUGnewFeature(locationName, status) {
            var geojsonFeature = {
                "type": "Feature",
                "properties": {
                    "status": status,
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