var mejorua = mejorua || {};
(function() {
    mejorua.Map = function Map() {

        this.pathToImages = 'img/map/';

        this.map = undefined;
        this.mapId = 'map';

        //UA: 38.383572, -0.512019
        //Torrevieja Glorieta: 37.977483, -0.682846
        this.latitude = 38.383572;
        this.longitude = -0.512019;

        //zoom UA 16 perfect en mi portatil
        this.zoom = 16;

        this.tileOSMURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        this.attributionOSM = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors';

        this.statusText = {
            done : "Hecho",
            inProgress: "En proceso",
            pending : "Pendiente"
        }

        this.init = function init() {
            console.log("mejorua.Map.init()");

            _.bindAll(this, "addGeoJSONpointToLayer");
            _.bindAll(this, "addGeoJSONonEachFeature");
            
            this.map = L.map(this.mapId).setView([this.latitude, this.longitude], this.zoom);

            //L.tileLayer(OSM_URL, { attribution: CM_ATTR, styleId: 997 }).addTo(map);
            L.tileLayer(this.tileOSMURL, {
                attribution: this.attributionOSM
            }).addTo(this.map);

            this.initIcons();

            this.DEBUGpopulateLocations();
            this.DEBUGpopulateMarkers();
        };

        this.initIcons = function initIcon() {

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
            //22 62
        }

        this.addGeoJSON = function addGeoJSON(geoJSON) {

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

        this.DEBUGpopulateLocations = function DEBUGpopulateLocations() {
            console.log("mejorua.Map.DEBUGpopulateLocations()");

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

        this.init();
    };
})();