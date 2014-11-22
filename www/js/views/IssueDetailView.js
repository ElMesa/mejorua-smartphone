var mejorua = mejorua || {};
mejorua.views = mejorua.views || {};

(function() {
    mejorua.views.IssueDetail = function IssueDetail(id, model, viewMode) {

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        /// ATRIBUTTES
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var self = this;
        this.id = undefined;
    	this.model = undefined;
        this.controller = undefined; //Set on controller.init(); Because view is first instantiated, then controller, wich calls init.
        this.viewMode = undefined;

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
        this.floorNameById = {
    		PS: 'Sotano',
    		PB: 'Planta baja',
    		P1: 'Planta primera',
    		P2: 'Planta segunda',
    		P3: 'Planta tercera',
    		P4: 'Planta cuarta'
        }
        
		
		
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        /// METHODS
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.init = function init(id, model, viewMode) {
            if(viewMode == undefined) viewMode = "read";
            console.log("views.IssueDetail.init()");

            this.id = id;
            this.templateId = 'issueDetailTemplate';
            this.placeholderId = id + '_placeholder';

            this.viewMode = viewMode;
            
            var templateSource = $('#' + this.templateId).html();
            this.template = Handlebars.compile(templateSource);
            
            if (model) this.setModel(model);
        }
        
        this.setModel = function setModel(model) {
        	if(this.model) this.model.off('change', this.update, this);
        	this.model = model;
        	this.model.on('change', this.update, this);
        	$(this.model).on('change', this.update);
        	this.update();
        }

        this.update = function update() {
            console.log("views.IssueDetail.update(model:%O)", self.model);

            var viewData = {};
            viewData.viewId = self.id;
            viewData.viewStateIcon = self.stateIcon[self.model.attributes.state];
            viewData.viewStateCSS = self.stateCSS[self.model.attributes.state];
            viewData.viewStateText = self.stateText[self.model.attributes.state];

            viewData.events = self.formatEvents(self.model.attributes.events);
            
            viewData.viewFloorName = self.floorNameById[self.model.get('SIGUAPlanta')];
            
            var templateData = $.extend({}, self.model.attributes, viewData);

            if(!templateData.SIGUAEstancia.attributes.denominacion) templateData.SIGUAEstancia.attributes.denominacion = templateData.SIGUAEstancia.attributes.codigo;

            if(this.viewMode == "read") {
                templateData.inputsDisabledCSS = "disabled";
                templateData.hideOnCreate = "";
                templateData.hideOnRead = 'style="display:none"';
            } else {
                templateData.inputsDisabledCSS = "";
                templateData.hideOnCreate = 'style="display:none"';
                templateData.hideOnRead = "";
            }

            var html = self.template(templateData);
            $('#' + self.placeholderId).html(html);

            if(self.controller) self.attachEventHandlers();
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

        this.setController = function setController(controller) {
            this.controller = controller;
            this.attachEventHandlers();
        }

        this.attachEventHandlers = function attachEventHandlers() {
            $('#' + self.placeholderId + " .submit").click(this.onSubmit);
        } 

        this.onSubmit = function onSubmit() {
            self.model.set('action', $('#' + self.id + "_issueDetailAction").val());
            self.model.set('term', $('#' + self.id + "_issueDetailTerm").val());
            self.controller.onNotifyIssueSubmit();
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        /// SELF INITILIZATION
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.init(id, model, viewMode);
    }
})();