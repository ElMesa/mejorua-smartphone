var mejorua = mejorua || {};
mejorua.models = mejorua.models || {};

(function (){
	mejorua.models.IssueCollection = Backbone.Collection.extend({
  		
  		name: "issues",
  		model: mejorua.models.Issue,
  		
  		initialize: function initialize(models, options) {
  			this.apiURL = options.apiURL;
  			this.url = this.apiURL + "/" + this.name;
  		}
	});
})();

