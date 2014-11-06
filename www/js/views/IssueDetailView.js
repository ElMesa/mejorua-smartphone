var mejorua = mejorua || {};
mejorua.views = mejorua.views || {};

(function() {
    mejorua.views.IssueDetail = function IssueDetail(id, model) {

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        /// ATRIBUTTES
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var self = this;
        this.id = undefined;
    	
    	this.model = undefined;

        this.templateId = undefined;
        this.template = undefined; //Handlebars template
        this.placeholderId = undefined;

        this.stateIcon = {
            PENDING: 'img/map/icon_pending.png',
            INPROGRESS: 'img/map/icon_inProgress.png',
            DONE: 'img/map/icon_done.png'
        }
        this.stateCSS = {
            PENDING: 'issueStatePendingBackground',
            INPROGRESS: 'issueStateInProgressBackground',
            DONE: 'issueStateDoneBackground'
        }
        this.stateText = {
            PENDING: 'Acción pendiente',
            INPROGRESS: 'Acción en progreso',
            DONE: 'Acción finalizada'
        }

        this.evenTypeText = {
            CREATE: 'Creada la incidencia',
            STATE_CHANGE_PENDING: 'Cambiado estado a pendiente',
            STATE_CHANGE_INPROGRESS: 'Cambiado estado a en progreso',
            STATE_CHANGE_DONE: 'Cambiado estado a finalizada'
        }
        this.evenTypeBackgroundCSS = {
            STATE_CHANGE_PENDING: 'issueStatePendingBackground',
            STATE_CHANGE_INPROGRESS: 'issueStateInProgressBackground',
            STATE_CHANGE_DONE: 'issueStateDoneBackground'
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        /// METHODS
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.init = function init(id, model) {
            console.log("views.IssueDetail.init()");

            this.id = id;
            this.templateId = 'issueDetailTemplate';
            this.placeholderId = id + '_placeholder';
            
            var templateSource = $('#' + this.templateId).html();
            this.template = Handlebars.compile(templateSource);
            
            if (model) this.setModel(model);
        }
        
        this.setModel = function setModel(model) {
        	if(this.model) this.model.off('change', this.update, this);
        	this.model = model;
        	this.model.on('change', this.update, this);
        	this.update();
        }

        this.update = function update() {
            console.log("views.IssueDetail.update(model:%O)", this.model);

            var viewData = {};
            viewData.viewId = this.id;
            viewData.viewStateIcon = this.stateIcon[this.model.attributes.state];
            viewData.viewStateCSS = this.stateCSS[this.model.attributes.state];
            viewData.viewStateText = this.stateText[this.model.attributes.state];

            viewData.events = this.formatEvents(this.model.attributes.events);
            
            var templateData = $.extend({}, this.model.attributes, viewData);

            var html = this.template(templateData);
            $('#' + this.placeholderId).html(html);
        }

        this.formatEvents = function formatEvents(events) {

        	var eventsViewData = undefined;
        	
        	if(events) {
	            var event;
	            var eventViewData;
	            
	            eventsViewData = [];
	
	            var count = events.length;
	            var i = 0;
	            for (i = 0; i < count; i++) {
	                event = events[i];
	                
	                eventViewData = {};
	                eventViewData.viewDate = (new Date(event.date)).toLocaleString();
	                eventViewData.viewType = this.evenTypeText[event.type];
	                eventViewData.viewBackgroundCSS = this.evenTypeBackgroundCSS[event.type];
	                eventsViewData.push(eventViewData);
	            }
        	}
        	
        	return eventsViewData;
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        /// SELF INITILIZATION
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.init(id, model);
    }
})();