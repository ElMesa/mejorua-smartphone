var mejorua = mejorua || {};
mejorua.controllers = mejorua.controllers || {};

(function() {
    mejorua.controllers.IssueDetail = function IssueDetail(model, view) {

    	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        /// ATRIBUTTES
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        var self = this;
        this.issues = undefined;
        this.model = undefined;
        this.view = undefined;

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        /// METHODS
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    	this.init = function init(model, view) {
    		console.log("mejorua.controllers.IssueDetail.init()");

    		this.issues = model;
        	this.view = view;
    	}

    	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        /// EVENTS
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.onLoadStateDefault = function onLoadStateDefault(data) {
        	if(data && data.issueId) {
	            var issueId = data.issueId;
	            self.model.set(self.issues.get(issueId).attributes);
	            //self.view.update(model);
            }
        }

    	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        /// SELF INITILIZATION
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.init(model, view);
    }
})();