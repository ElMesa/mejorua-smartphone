var mejorua = mejorua || {};
mejorua.controllers = mejorua.controllers || {};

(function() {
    mejorua.controllers.Page = function Page() {

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        /// ATRIBUTTES
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        var self = this;
        this.defaultPage = undefined;
        this.actualPage = undefined;
        this.pages = {}; //HashMap of {String} pageId -> {Page}
        //{Page} Class
        //var examplePage =  {
        //  id: "htmlDivId"
        //  title: "Browser title to display"
        //  url: "Browser url to display"
        //}
        this.pagesOrder = []; //Ordered page id's. The order affects the slide animation direction between pages, being the most left and the last one the most right


        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        /// METHODS
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        this.init = function init() {
            /*
            var pageMap = {
                id: "pageMap",
                state: {
                    default: {
                        title: "Mejor UA - Mapa",
                        url: "mapa"
                    },
                    newIssue: {
                        title: "Mejor UA - Mapa - Notificar incidencia",
                        url: "mapa/notificarIncidencia",
                        onLoad: mejorua.app.map.onLoadStateNewIssue
                    }
                }
            }
            pageMap.actualState = pageMap.state['default'];

            var pageIssueDetail = {
                id: "pageIssueDetail",
                state: {
                    default: {
                        title: "Mejor UA - Detalles incidencia",
                        url: "detallesIncidencia"
                    }
                }
            }
            pageIssueDetail.actualState = pageIssueDetail.state['default'];

            var pageRESTClient = {
                id: "pageRESTClient",
                state: {
                    default: {
                        title: "Mejor UA - Cliente REST",
                        url: "clienteREST"
                    }
                }
            }
            pageRESTClient.actualState = pageRESTClient.state['default'];

            this.defaultPage = pageMap;
            this.actualPage = this.defaultPage;

            this.pages[pageMap.id] = pageMap;
            this.pages[pageIssueDetail.id] = pageIssueDetail;
            this.pages[pageRESTClient.id] = pageRESTClient;

            this.pagesOrder.push(pageMap);
            this.pagesOrder.push(pageIssueDetail);
            this.pagesOrder.push(pageRESTClient);
            */

            this.defaultPage = this.pagesOrder[0];
            //this.actualPage = this.defaultPage;
            this.actualPage = {id: -1};

            var i = 0;
            var count = this.pagesOrder.length;
            for (i = 0; i < count; i++) {
                $('#' + this.pagesOrder[i].id).hide();
            }

            //$('#' + this.actualPage.id).fadeIn();
        }

        this.add = function add(page) {
            this.pages[page.id] = page;
            this.pagesOrder.push(page);
        }

        

        this.show = function show(targetPageId, targetState, data, shouldPushBrowserHistory) {

            var targetPage = this.pages[targetPageId];
            if (targetState == undefined) targetState = 'default';
            if (shouldPushBrowserHistory == undefined) shouldPushBrowserHistory = true;

            //Check if page exists
            if (targetPage != undefined) {

                //Check if state exists
                if (targetPage.state[targetState] != undefined) {

                    var isDiferentPage = targetPage.id != this.actualPage.id;
                    var isSamePageWithDifferentSate = (targetPage.id == this.actualPage.id && targetState != this.actualPage.actualState);

                    //Only act if there are changes
                    if (isDiferentPage || isSamePageWithDifferentSate) {

                        //TODO - Page - ¿Maybe prepare state before transition? And leave further animations post page transition
                        var onLoadState = this.pages[targetPageId].state[targetState].onLoad;
                        if (onLoadState != undefined) onLoadState(data);

                        //Check if transition to page is needed
                        if (isDiferentPage) {

                           this.smartTransition(this.actualPage.id, targetPage.id);

                           this.markActiveNavbar(targetPage.id);
                           
                        }

                        if (shouldPushBrowserHistory) {
                            window.history.pushState({
                                page: JSON.stringify(targetPage)
                            }, "", targetPage.state[targetState].url);
                            document.title = targetPage.state[targetState].title;
                            console.log("mejorua.controllers.Page.show() - window.history = %O", window.history);
                        }

                        targetPage.actualState = targetState;
                        this.actualPage = targetPage;
                    }
                } else {
                    console.log("ERROR - mejorua.controllers.Page.show() - Undefined state %O for page %O", targetState, targetPage);
                }
            } else {
                console.log("ERROR - mejorua.controllers.Page.show() - Undefined page: %O", targetPage);
            }
        }
        
        this.smartTransition = function transition(pageIdFrom, pageIdTo) {

        	var slideFrom = pageIdFrom;
            var slideTo = pageIdTo;
            var slideOut = '';
            var slideIn = '';

            var actualPagePosition = this.pagePosition(pageIdFrom);
            var targetPagePosition = this.pagePosition(pageIdTo);

            //Slide transition on known pages (id > 0)
            if(actualPagePosition >= 0 && targetPagePosition >=0) {
	            if (targetPagePosition < actualPagePosition) {
	                slideOut = 'right';
	                slideIn = 'left';
	            } else {
	                slideOut = 'left';
	                slideIn = 'right';
	            }
	
	            this.transition(slideFrom, slideTo, slideOut, slideIn);
            } else {
            	this.transition(slideFrom, slideTo, slideOut, slideIn, true);
            }
        }
        
        this.transition = function transition(slideFrom, slideTo, slideOut, slideIn, useFadeTransition) {

            var delay = 500;
            var transitionEnd = delay * 2;
            var firstTransitionType = 'slide';
            var secondTransitionType = 'slide';
            
            if(!useFadeTransition) {	
	            $('#' + slideFrom).hide(firstTransitionType, {
	                direction: slideOut
	            }, delay);
	            $('#' + slideTo).delay(delay).show(secondTransitionType, {
	                direction: slideIn
	            }, delay);
            } else {
            	$('#' + slideFrom).fadeOut(delay);
	            $('#' + slideTo).delay(delay).fadeIn(delay);
            }

            return transitionEnd;
        }
        
        this.markActiveNavbar = function markActiveNavbar(activePageId) {
        	
        	for(index in this.pages) {
        		
        		var pageId = this.pages[index].id;
        			
        		if(pageId == activePageId) {
        			$('#navbar-' + pageId).toggleClass('active', true);
        		} else {
        			$('#navbar-' + pageId).toggleClass('active',false);
        		}
        	}
        }

        /*
        this.pushState = function pushState(page, state) {
            if(!state) state = 'default';

            document.title = page.state[state].title;
                window.history.pushState({
                    page: JSON.stringify(page),
                }, "", page.state[state].url);
        }
*/
        //Hack browser history to change the page
        window.onpopstate = function(e) {
            console.log("mejorua.controllers.Page - window.onpopstate()");
            if (e.state) {
                console.log("mejorua.controllers.Page - window.onpopstate() - e = %O", e);

                //document.getElementById("content").innerHTML = e.state.html;
                var targetPage = JSON.parse(e.state.page);
                console.log("mejorua.controllers.Page - window.onpopstate() - show(%O)", targetPage.id);
                self.show(targetPage.id, targetPage.actualState.id, undefined, false);
            } else {
                self.show(self.defaultPage.id, 'default', undefined, false);
            }
        };

        this.pagePosition = function pagePosition(pageId) {
            var index = 0;
            var found = false;
            
            if(pageId != -1) {
	            while (!found) {
	                if (this.pagesOrder[index].id == pageId) {
	                    found = true;
	                } else {
	                    index++;
	                }
	            }
            }

            if (found == false) index = -1;

            return index;
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        /// SELF INITILIZATION
        ///
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //this.init();
    }
})();