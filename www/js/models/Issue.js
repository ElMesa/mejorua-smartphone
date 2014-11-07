var mejorua = mejorua || {};
mejorua.models = mejorua.models || {};

(function (){
	mejorua.models.Issue = Backbone.Model.extend({
		id: undefined,
	 	latitude: undefined,
	  	longitude: undefined,
	  	action: undefined,
	  	term: undefined,
	  	state: undefined,
	  	SIGUAId: undefined,
	  	SIGUASede: undefined,
	  	SIGUAEdificio: undefined,
	  	SIGUAEstancia: undefined,
	  	initialize: function() {
	  		
	  		var self = this;
	  		
	  		this.set('SIGUASede', new mejorua.models.SIGUA.Sede());
	  		this.set('SIGUAEdificio',new mejorua.models.SIGUA.Edificio());
	  		this.set('SIGUAEstancia', new mejorua.models.SIGUA.Estancia());
	  		
	  		this.on('change:SIGUAEstancia', function(model, options){
				console.log('mejorua.models.Issue on change:SIGUAEstancia - Fetch sede - Fetch edificio');
				
				var SIGUASede = this.get('SIGUASede');
				SIGUASede.set('id', this.get('SIGUAEstancia').get('codigo').substring(0,2));
				SIGUASede.on('change', function() {
					$(self).trigger('change');
					});
				SIGUASede.fetch();
				
				var SIGUAEdificio = this.get('SIGUAEdificio');
				SIGUAEdificio.set('id', this.get('SIGUAEstancia').get('codigo').substring(0,4));
				SIGUAEdificio.on('change', function() { 
					$(self).trigger('change'); 
					});
				SIGUAEdificio.fetch();
	  		}, this);
	  		
	  		this.on('change', function(model, options) {
	  			if(model.changed.latitude || model.changed.longitude) {
  					console.log('mejorua.models.Issue on change:latitude || change:longitude');
	  				
	  				var apiURL = mejorua.app.api.url;
	  				var targetURL = 'http://www.sigua.ua.es/apirest/pub/estancia/coordenada/' + model.get('SIGUAPlanta') + '/' + model.get('longitude') + '/' + model.get('latitude');
	  				var targerURLEncoded = encodeURIComponent(targetURL);
	  				
	  				$.ajax({
	  					url: apiURL + '/proxy?url=' + targerURLEncoded,
	  					dataType: 'json',
	  				}).done(function(data){
	  					console.log('mejorua.models.Issue - on fetch "estancia" close to lat/long - RESPONSE: %O', data);
	  					var featureCollection = data;
	  					var feature = featureCollection.features[0];
	  					var SIGUAId = feature.properties.codigo;
	  					self.set('SIGUAId', SIGUAId);
	  					self.set('SIGUAPlanta', SIGUAId.substring(4, 6));
	  					var SIGUAEstancia = new mejorua.models.SIGUA.Estancia(feature.properties);
	  					//self.get('SIGUAEstancia').set(SIGUAEstancia.attributes);
	  					self.set('SIGUAEstancia', SIGUAEstancia);
	  				});
	  				
	  			}
	  		}, this);
	  	},
	  	// Filter attributtes on save (http://stackoverflow.com/questions/13051966/exclude-model-properties-when-syncing-backbone-js)
	  	// Overwrite save function
	    save: function(attrs, options) {
	        options || (options = {});
	        attrs || (attrs = _.clone(this.attributes));

	        // Filter the data to send to the server
	        //delete attrs.selected;
	        //delete attrs.dontSync;

	        options.data = JSON.stringify(attrs);

	        // Proxy the call to the original save function
	        Backbone.Model.prototype.save.call(this, attrs, options);
	    }
	});
})();
