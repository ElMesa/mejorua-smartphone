var mejorua = mejorua || {};
mejorua.models = mejorua.models || {};

(function() {
    mejorua.models.IssueCollection = Backbone.Collection.extend({

        name: "issues",
        model: mejorua.models.Issue,

        initialize: function initialize(models, options) {
            console.log('mejorua.models.IssueCollection.initialize()');

            _.bindAll(this, "onSync");
            _.bindAll(this, "getGeoJSON");

            //Pass intitilize(options) to this object
            this.apiURL = options.apiURL;
            this.map = options.map;

            this.url = this.apiURL + "/" + this.name;

            /*
            this.on('sync', function() {
                console.log('mejorua.models.IssueCollection - on(\'sync\')');
                $(this.map).trigger('modelUpdated');
            });
            */
            this.on('sync', this.onSync);
        },

        myFetch: function myFetch() {
            var promise = this.fetch({
                success: function(collection, response, options) {
                    console.log("mejorua.models.IssueCollection.myFetch() - collection:%O response:%O, options:%O", collection, response, options);
                },
                error: function() {
                    console.log("mejorua.models.IssueCollection.myFetch() - fetch ERROR");
                }
            });

            return promise;
        },

        onSync: function onSync(event) {
            console.log('mejorua.models.IssueCollection.onSync()');
            $(this.map).trigger('modelUpdated', [this.getGeoJSON()]);
        },

        getGeoJSON: function getGeoJSON() {
            console.groupCollapsed('mejorua.models.IssueCollection.getGeoJSON()');

            geoJSON = [];

            var i = 0;
            var count = this.length;
            for (i = 0; i < count; i++) {
                console.log('mejorua.models.IssueCollection.getGeoJSON() i=%i geoJSON=%O', i, this.models[i].get('geoJSONFeature'));
                //console.log(JSON.stringify(this.models[i].get('geoJSONFeature'), undefined, 2));
                geoJSON.push(this.models[i].get('geoJSONFeature'));
            }

            console.groupEnd();
            return geoJSON;
        }
    });
})();