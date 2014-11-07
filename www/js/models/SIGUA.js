var mejorua = mejorua || {};
mejorua.models = mejorua.models || {};

mejorua.models.SIGUA = {};

(function (){
	mejorua.models.SIGUA.Sede = Backbone.Model.extend({
		urlRoot: 'http://www.sigua.ua.es/api/pub/sede',
		id: undefined,
		nombre: undefined,
		count_edificios: undefined,
		bbox: undefined
		});
})();

(function (){
	mejorua.models.SIGUA.Edificio = Backbone.Model.extend({
		urlRoot: 'http://www.sigua.ua.es/api/pub/edificio',
		id: undefined,
		nombre: undefined,
		bbox: undefined,
		count_geometrias: undefined,
		plantas: undefined
		});
})();	
    	
(function (){
	mejorua.models.SIGUA.Estancia = Backbone.Model.extend({
		urlRoot: 'http://www.sigua.ua.es/api/pub/estancia',
		sede: undefined,
		edificio: undefined,
		codigo: undefined,
		id_actividad: undefined,
		nombre_actividad: undefined,
		superficie: undefined,
		lon: undefined,
		lat: undefined,
		id_departamentosigua: undefined,
		nombre_departamentosigua: undefined,
		denominacion: undefined,
		ubicaciones: undefined,
		observaciones: undefined
		});
})();