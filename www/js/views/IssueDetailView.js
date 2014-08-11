var mejorua = mejorua || {};
mejorua.views = mejorua.views || {};

(function() {
    mejorua.views.IssueDetail = function IssueDetail() {

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        ///	ATRIBUTTES
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.model = undefined;

        this.templateId = 'issueDetailTemplate';
        this.template = undefined; //Handlebars template
        this.drawId = 'issueDetail';

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
        	create: 'Creada la incidencia',
        	state_change_pending: 'Cambiado estado a pendiente',
        	state_change_inProgress: 'Cambiado estado a en progreso',
        	state_change_done: 'Cambiado estado a finalizada'
        }
        this.evenTypeBackgroundCSS = {
        	state_change_pending: 'issueStatePendingBackground',
        	state_change_inProgress: 'issueStateInProgressBackground',
        	state_change_done: 'issueStateDoneBackground'
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        ///	METHODS
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.init = function init() {
            console.log("views.IssueDetail.init()");

            var templateSource = $('#' + this.templateId).html();
            this.template = Handlebars.compile(templateSource);
        }

        this.update = function update(model) {
            console.log("views.IssueDetail.update(model:%O)", model);

            if(model) this.model = model;

            this.model.viewStateIcon = this.stateIcon[this.model.state];
            this.model.viewStateCSS = this.stateCSS[this.model.state];
            this.model.viewStateText = this.stateText[this.model.state];

            this.formatEvents(this.model.events);

            var html = this.template(this.model);
            $('#' + this.drawId).html(html);
        }

        this.formatEvents = function formatEvents(events) {

            var event;

            var count = events.length;
            var i = 0;
            for (i = 0; i < count; i++) {
                event = events[i];
                event.viewDate = (new Date(event.date)).toLocaleString();
                event.viewType = this.evenTypeText[event.type];
                event.viewBackgroundCSS = this.evenTypeBackgroundCSS[event.type];
            }
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        ///	SELF INITILIZATION
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.init();
    }
})();