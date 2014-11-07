var mejorua = mejorua || {};

(function() {
    mejorua.Map = function Map(issueDetailModel, notifyIssueModel) {

    	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        /// ATTRIBUTES
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    	
        var self = this;
        
        this.model = {};
        this.model.issues = undefined;
        this.model.issueDetail = undefined;
        this.model.notifyIssue = undefined;
        
        this.floorSelector = new mejorua.views.MapFloorSelector();
        
        this.map = undefined; //Leafleat Map
        this.geoJSON = undefined; //GeoJSON to display
        this.newIssueMarker = undefined;

        this.pathToImages = 'img/map/';
        
        this.state = {};
        this.state.list = ['showIssues',
                           'notifyIssue'];
        this.state.default = 'showIssues';
        this.state.actual = undefined;
        this.state.showIssues = {};
        this.state.showIssues.onLoad = undefined;
        this.state.showIssues.onUnload = undefined;
        this.state.notifyIssue = {};
        this.state.notifyIssue.onLoad = undefined;
        this.state.notifyIssue.onUnload = undefined;
        
        this.mapId = 'map';
        this.latitude = 38.383572; // Leaflet map default latitude - Set to University of Alicante
        this.longitude = -0.512019; // Leaflet map default longitude - Set to University of Alicante
        this.zoom = 16; // Leaflet map zoom level - Level 16 in University of Alicante works like a charm in my laptop
        this.zoomMin = 5;
        this.zoomMinFloor = 19;
        this.zoomMax= 21;

        this.tileOSMURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        this.attributionOSMText = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        this.attributionSIGUAText ='Datos mapa &copy; <a href="http://www.sigua.ua.es">SIGUA</a>';
        this.attributionText = this.attributionSIGUAText;
        
        this.tiles = {};
        this.tiles.background = undefined;
        this.tiles.floor = {};
        this.tiles.floor.basement = {};
        this.tiles.floor.ground = {};
        this.tiles.floor.first = {};
        this.tiles.floor.second = {};
        this.tiles.floor.third = {};
        this.tiles.floor.fourth = {};
        this.tiles.url = {};
        this.tiles.url.sigua = {};
        this.tiles.url.sigua.background = undefined;
        this.tiles.url.sigua.floor = {};
        this.tiles.url.sigua.floor.basement = {};
        this.tiles.url.sigua.floor.ground = {};
        this.tiles.url.sigua.floor.first = {};
        this.tiles.url.sigua.floor.second = {};
        this.tiles.url.sigua.floor.third = {};
        this.tiles.url.sigua.floor.fourth = {};
        
        //SIGUA tiles for codes are ignored because right now aren't used
        this.tiles.url.sigua.background = 'http://www.sigua.ua.es/cache/tms/1.0.0/BASE/webmercator_mod/{z}/{x}/{y}.png';
        
        this.tiles.url.sigua.floor.basement.background = 'http://www.sigua.ua.es/cache/tms/1.0.0/PS_D_TEMA/webmercator_mod/{z}/{x}/{y}.png';
        this.tiles.url.sigua.floor.basement.deno = 'http://www.sigua.ua.es/cache/tms/1.0.0/PS_T_DENO/webmercator_mod/{z}/{x}/{y}.png';
        //this.tiles.url.sigua.floor.basement.codigo = 'http://www.sigua.ua.es/cache/tms/1.0.0/PS_T_CODIGO/webmercator_mod/{z}/{x}/{y}.png';
        
        this.tiles.url.sigua.floor.ground.background = 'http://www.sigua.ua.es/cache/tms/1.0.0/PB_D_TEMA/webmercator_mod/{z}/{x}/{y}.png';
        this.tiles.url.sigua.floor.ground.deno = 'http://www.sigua.ua.es/cache/tms/1.0.0/PB_T_DENO/webmercator_mod/{z}/{x}/{y}.png';
        //this.tiles.url.sigua.floor.ground.codigo = 'http://www.sigua.ua.es/cache/tms/1.0.0/PB_T_CODIGO/webmercator_mod/{z}/{x}/{y}.png';
        
        this.tiles.url.sigua.floor.first.background = 'http://www.sigua.ua.es/cache/tms/1.0.0/P1_D_TEMA/webmercator_mod/{z}/{x}/{y}.png';
        this.tiles.url.sigua.floor.first.deno = 'http://www.sigua.ua.es/cache/tms/1.0.0/P1_T_DENO/webmercator_mod/{z}/{x}/{y}.png';
        //this.tiles.url.sigua.floor.first.codigo = 'http://www.sigua.ua.es/cache/tms/1.0.0/P1_T_CODIGO/webmercator_mod/{z}/{x}/{y}.png';
        
        this.tiles.url.sigua.floor.second.background = 'http://www.sigua.ua.es/cache/tms/1.0.0/P2_D_TEMA/webmercator_mod/{z}/{x}/{y}.png';
        this.tiles.url.sigua.floor.second.deno = 'http://www.sigua.ua.es/cache/tms/1.0.0/P2_T_DENO/webmercator_mod/{z}/{x}/{y}.png';
        //this.tiles.url.sigua.floor.second.codigo = 'http://www.sigua.ua.es/cache/tms/1.0.0/P2_T_CODIGO/webmercator_mod/{z}/{x}/{y}.png';
        
        this.tiles.url.sigua.floor.third.background = 'http://www.sigua.ua.es/cache/tms/1.0.0/P3_D_TEMA/webmercator_mod/{z}/{x}/{y}.png';
        this.tiles.url.sigua.floor.third.deno = 'http://www.sigua.ua.es/cache/tms/1.0.0/P3_T_DENO/webmercator_mod/{z}/{x}/{y}.png';
        //this.tiles.url.sigua.floor.third.codigo = 'http://www.sigua.ua.es/cache/tms/1.0.0/P3_T_CODIGO/webmercator_mod/{z}/{x}/{y}.png';
        
        this.tiles.url.sigua.floor.fourth.background = 'http://www.sigua.ua.es/cache/tms/1.0.0/P4_D_TEMA/webmercator_mod/{z}/{x}/{y}.png';
        this.tiles.url.sigua.floor.fourth.deno = 'http://www.sigua.ua.es/cache/tms/1.0.0/P4_T_DENO/webmercator_mod/{z}/{x}/{y}.png';
        //this.tiles.url.sigua.floor.fourth.codigo = 'http://www.sigua.ua.es/cache/tms/1.0.0/P4_T_CODIGO/webmercator_mod/{z}/{x}/{y}.png';
        
        this.layer = {};
        this.layer.group = {};
        this.layer.group.default = 'ground';
        this.layer.background = undefined;
        this.layer.floor = {};
        this.layer.floor.basement = {};
        this.layer.floor.ground = {};
        this.layer.floor.first = {};
        this.layer.floor.second = {};
        this.layer.floor.third = {};
        this.layer.floor.fourth = {};
        this.layer.issues = undefined;
        this.layer.notifyIssue = undefined;
        
        this.marker = {};
        this.marker.notifyIssue = undefined;
        
        this.floorDefault = 'ground';
        this.floor = undefined;
        
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
        
        this.mapFloor2SIGUAFloor = {
    		basement: 'PS',
            ground: 'PB',
            first: 'P1',
            second: 'P2',
            third: 'P3',
            fourth: 'P4' 
        }

        //Icon associated with a state. INITIALIZED AT initIcon()
        this.stateIcon = undefined;

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        /// METHODS - INIT
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        this.init = function init(issueDetailModel, notifyIssueModel) {
            console.log("mejorua.Map.init()");
            
            this.model.issueDetail = issueDetailModel;
            this.model.notifyIssue = notifyIssueModel;

            _.bindAll(this, "addGeoJSONpointToLayer");
            _.bindAll(this, "addGeoJSONonEachFeature");
            _.bindAll(this, "onModelUpdated");

            //Init Leaflet Map
            this.map = L.map(this.mapId).setView([this.latitude, this.longitude], this.zoom);

            this.initLayers();
            
            this.initIcons();
            
            this.setFloor(this.floorDefault);
            
            this.setState(this.state.default);

            $(this).on('modelUpdated', this.onModelUpdated);

            //this.DEBUGpopulateLocations();
            //this.DEBUGpopulateMarkers();
        };
        
        this.initLayers = function initLayers() {
        	
        	//Load OSM map tiles + attribution
            /*
            L.tileLayer(this.tileURL, {
                attribution: this.attributionText
            }).addTo(this.map);
            */
            
        	//Create background layer and add it to the map
            this.layer.background = this.newLayer({
            	tileURL: this.tiles.url.sigua.background
            }).addTo(this.map);
            
            //Create floor's layers and group them
            for (floor in this.tiles.url.sigua.floor) {
            	for (layer in this.tiles.url.sigua.floor[floor]) {
            		this.layer.floor[floor][layer] = this.newLayer({
                    	tileURL: this.tiles.url.sigua.floor[floor][layer],
                    	minZoom: this.zoomMinFloor
                    });
            	}
            	
            	//Extract layers as array
            	var layersArray = $.map(this.layer.floor[floor], function(value, index) {
            	    return [value];
            	});
            	
            	//Each floor is a layer group
            	this.layer.group[floor] = L.layerGroup(layersArray);
        	}
            
            //Add default floor layer group to the map
            //this.layer.group[this.layer.group.default].addTo(this.map);
            
        }

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
        
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        /// METHODS - MAP INTERNALS
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        this.newLayer = function addLayer(override) {
        	
        	//Default config
        	layerConfig = {
        		tileURL: this.tileURL,
				tms: true,
				transparent: true,
				maxZoom: this.zoomMax,
				minZoom: this.zoomMin,
				unloadInvisibleTiles: true,
				attribution: this.attributionText
        	}
        	
        	//Apply config override
        	for (parameter in override) {
        		if(override[parameter] != undefined && override[parameter] != null) layerConfig[parameter] = override[parameter];
        	}      	
        	//if(override['tms'] != undefined && override['tms'] != null) layerConfig['tms'] = override['tms'];
        	
        	var tileLayer = L.tileLayer(layerConfig.tileURL, {
				 tms: layerConfig.tms,
				 transparent: layerConfig.transparent,
				 maxZoom: layerConfig.maxZoom,
				 minZoom: layerConfig.minZoom,
				 unloadInvisibleTiles: layerConfig.unloadInvisibleTiles,
				 attribution: layerConfig.attribution
           });
        	
        	return tileLayer;
        }

        this.addGeoJSON = function addGeoJSON(geoJSON) {
            console.log("mejorua.Map.addGeoJSON(geoJSON:%O)", geoJSON);

            //Remove old issues layer
            if(this.layer.issues) this.map.removeLayer(this.layer.issues);
            
            //Get the updated layer
            var issues = L.geoJson(geoJSON, {
                pointToLayer: this.addGeoJSONpointToLayer,
                onEachFeature: this.addGeoJSONonEachFeature
            });
            
            this.layer.issues = issues;
            
            //Add it to the map if in "showIssues" state
            if(this.state.actual == 'showIssues') {
            	this.map.addLayer(issues);
            }
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
                    //'<a href="javascript:mejorua.app.page.show(\'pageIssueDetail\', undefined, {issueId: ' + feature.properties.id + '}, true)" class="btn btn-xs btn-primary">Ver detalles</a>' +
                    '<a href="javascript:mejorua.app.map.state.showIssues.showIssueDetail(' + feature.properties.id + ')" class="btn btn-xs btn-primary">Ver detalles</a>' +
                    
                    '</p>';
                layer.bindPopup(popupText, {
                    className: this.stateCSS[feature.properties.state]
                });
            }
        }

        //http://stackoverflow.com/questions/18575722/leaflet-js-set-marker-on-click-update-postion-on-drag
        this.addNotifyIssueMarker = function addNotifyIssueMarker(e) {
            console.log("mejorua.Map.addNotifyIssueMarker(e:%O)", e);

            if(!self.marker.notifyIssue) {
            	
	            var marker = new L.marker(e.latlng, {
	                id: 'notifyIssueMarker',
	                icon: self.iconPending,
	                draggable: 'true'
	            });
	            
	            marker.bindPopup("Puede mejorar la precisión de la incidencia haciendo click sobre el mapa");
	            
	            self.marker.notifyIssue = marker;
	            self.map.addLayer(self.marker.notifyIssue);
	            marker.openPopup();
	            
            } else {
            	self.marker.notifyIssue.setLatLng(e.latlng);
            }
        };
        
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        /// METHODS - SETTER'S
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        this.setState = function setState(newState) {
        	console.log('mejorua.Map.setState(%O)', newState);
        	        	
        	switch(newState) {
	            case 'showIssues':
	            	this.state.actual = 'showIssues';
	            	this.state.notifyIssue.onUnload();
	            	this.state.showIssues.onLoad();
	                break;
	                
	            case 'notifyIssue':
	            	this.state.actual = 'notifyIssue';
	            	this.state.showIssues.onUnload();
	            	this.state.notifyIssue.onLoad();
	                break;
	                
	            default:
	            	console.log('mejorua.Map.setState(%O) - ERROR - Unknown state', newState);
	        } 
        }
        
        this.setFloor = function setFloor(newFloor) {
        	console.log('mejorua.Map.setFloor(%O)', newFloor);
        	
        	//Update view - Floor selector
        	this.floorSelector.setFloor(newFloor);
        	
        	if(this.floor != undefined && this.floor != null) this.map.removeLayer(this.layer.group[this.floor]);
        	this.map.addLayer(this.layer.group[newFloor]);
        	this.floor = newFloor;
        	
        	//this.debug.showLayers();
        };
        
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        /// STATES
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        this.state.showIssues.onLoad = function showIssues_onLoad() {
        	if(self.layer.issues) {
	        	if(!self.map.hasLayer(self.layer.issues)) {
	        		self.map.addLayer(self.layer.issues);
	        	}
        	}
        }
        
        this.state.showIssues.onUnload = function showIssues_onUnload() {
        	if(self.layer.issues) {
	        	if(self.map.hasLayer(self.layer.issues)) {
	        		self.map.removeLayer(self.layer.issues);
	        	}
        	}
        }
        
        this.state.showIssues.showIssueDetail = function showIssues_showIssueDetail(issueId) {
        	self.model.issueDetail.set(self.model.issues.get(issueId).attributes);
        	mejorua.app.page.show('pageIssueDetail', undefined, issueId, true);
        }
        
        this.state.notifyIssue.onLoad = function notifyIssue_onLoad() {
        	var $controls = $('#' + 'map_notifyIssue_controls');
        	$controls.fadeIn();
        	
        	self.map.on('click', self.addNotifyIssueMarker);
        	
        	if(self.marker.notifyIssue) {
	        	if(!self.map.hasLayer(self.marker.notifyIssue)) {
	        		self.map.addLayer(self.marker.notifyIssue);
	        	}
        	}
        }
        
        this.state.notifyIssue.onUnload = function notifyIssue_onUnload() {
        	var $controls = $('#' + 'map_notifyIssue_controls');
        	$controls.fadeOut();
        	
        	self.map.off('click', self.addNotifyIssueMarker);
        	
        	if(self.marker.notifyIssue) {
	        	if(self.map.hasLayer(self.marker.notifyIssue)) {
	        		self.map.removeLayer(self.marker.notifyIssue);
	        	}
        	}
        }
        
        this.state.notifyIssue.confirm = function notifyIssue_confirm() {
        	console.log('mejorua.Map.state.notifyIssue.confirm()');
        	
        	if(self.marker.notifyIssue) {
        		var position = self.marker.notifyIssue.getLatLng();
        		self.model.notifyIssue.set({
        			latitude: position.lat,
        			longitude: position.lng,
        			SIGUAPlanta: self.mapFloor2SIGUAFloor[self.floor]
        		});
        		mejorua.app.page.show('pageNotifyIssue', undefined, undefined, true);
        		self.setState('showIssues');
        		
        	} else {
        		//TODO - REFACTOR - To js/toastr.js toaster.init() //Or simply App.js
        		toastr.options = {
        			"positionClass": "toast-bottom-full-width"
        		}
        		toastr.info('Haga click en el lugar de la incidencia para poder notificarla.');
        	}
        }
        
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        /// EVENTS
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        this.onModelUpdated = function onModelUpdated(event, issues) {
            console.log("mejorua.Map.onModelUpdated(issues:%O)", issues);

            this.model.issues = issues;
            
            this.addGeoJSON(issues.getGeoJSON());
        }

        this.onLoadStateNewIssue = function onNewIssueMarkerClick() {
        	console.log("mejorua.Map.onNewIssueMarkerClick()");
        	self.setState('notifyIssue');
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

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        /// DEBUG
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        this.debug = {};
        
        this.debug.showLayers = function DEBUGshowLayers() {
        	this.map.eachLayer(function (layer) {
        	    console.log(layer);
        	});
        }
        
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

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        /// SELF INITIALIZATION
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        this.init(issueDetailModel, notifyIssueModel);
    }
})();