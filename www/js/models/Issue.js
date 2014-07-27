var mejorua = mejorua || {};
mejorua.models = mejorua.models || {};

(function (){
	mejorua.models.Issue = Backbone.Model.extend({
	 	latitude: undefined,
	  	longitude: undefined,
	  	action: undefined,
	  	term: undefined
	});
})();