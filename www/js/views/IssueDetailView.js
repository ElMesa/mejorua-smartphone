var mejorua = mejorua || {};
mejorua.views = mejorua.views || {};

(function() {
    mejorua.views.IssueDetail = function IssueDetail() {

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        /// ATRIBUTTES
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
        this.init = function init() {
            console.log("views.IssueDetail.init()");

            var templateSource = $('#' + this.templateId).html();
            this.template = Handlebars.compile(templateSource);
        }

        this.update = function update(model) {
            console.log("views.IssueDetail.update(model:%O)", model);

            if (model) this.model = model;

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
        /// SELF INITILIZATION
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.init();
    }
})();