var mejorua = mejorua || {};

$(document).ready(function() {

    mejorua.app = new mejorua.controllers.App();

    initPages();

    //TODO - REFACTOR - Move to a controller/header.js
    $('.navbar-collapse.in a').on('click', function() {
        $(".navbar-toggle").click();
    });

    //DEBUGPUT(mejorua.app.api.url);
    //DEBUGPOST(mejorua.app.api.url);
});

//TODO - REFACTOR - Move to controller/page.js
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///
/// PAGE HANDDLING
///
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function initPages() {
    actualPage = 'pageMap';

    $('#pageMap').hide();
    $('#pageRestClient').hide();
    $('#pageIssueDetail').hide();

    $('#' + actualPage).fadeIn();
}

function pageTransition(slideFrom, slideTo, slideOut, slideIn) {

    var delay = 500;

    $('#' + slideFrom).hide('slide', {
        direction: slideOut
    }, delay);
    $('#' + slideTo).delay(delay).show('slide', {
        direction: slideIn
    }, delay);
}

function pageShowIssueDetail() {

    if (actualPage != 'pageIssueDetail') {

        var slideFrom = actualPage;
        var slideTo = 'pageIssueDetail';
        var slideOut = '';
        var slideIn = '';

        switch (actualPage) {
            case 'pageMap':
                slideOut = 'left';
                slideIn = 'right';
                break;
            case 'pageRestClient':
                slideOut = 'right';
                slideIn = 'left';
                break;
        }

        pageTransition(slideFrom, slideTo, slideOut, slideIn);

        actualPage = 'pageIssueDetail';
    }
}

//TODO - REFACTOR - Using pageTransition
function pageShowMap() {

    if (actualPage != 'pageMap') {

        var slideFrom = actualPage;
        var slideTo = 'pageMap';
        var slideOut = '';
        var slideIn = '';

        switch (actualPage) {
            case 'pageIssueDetail':
                slideOut = 'right';
                slideIn = 'left';
                break;
            case 'pageRestClient':
                slideOut = 'right';
                slideIn = 'left';
                break;
        }

        pageTransition(slideFrom, slideTo, slideOut, slideIn);

        actualPage = 'pageMap';

    }
}

//TODO - REFACTOR - Using pageTransition
function pageShowRestClient() {
    
    if (actualPage != 'pageRestClient') {

        var slideFrom = actualPage;
        var slideTo = 'pageRestClient';
        var slideOut = '';
        var slideIn = '';

        switch (actualPage) {
            case 'pageMap':
                slideOut = 'left';
                slideIn = 'right';
                break;
            case 'pageRestClient':
                slideOut = 'left';
                slideIn = 'right';
                break;
        }

        pageTransition(slideFrom, slideTo, slideOut, slideIn);

        actualPage = 'pageRestClient';

    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///
/// DEBUG
///
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function DEBUGPUT(apiURL) {
    console.log("window.testPUT(" + apiURL + ")");

    xmlhttp = new XMLHttpRequest();

    xmlhttp.open("PUT", apiURL + "/incidencia/1", false);
    //xmlhttp.setRequestHeader("Accept","application/json; charset=UTF-8");
    //xmlhttp.setRequestHeader("Content-Type","application/json; charset=UTF-8");
    xmlhttp.setRequestHeader("Content-Type", "multipart/form-data");
    xmlhttp.send('{"id":"1","latitud":"2","longitud":"2","termino":"xmlhttp testPUT","accion":"xmlhttp testPUT"}');

    xmlhttp.open("GET", apiURL + "/incidencia/1", false);
    xmlhttp.send();
    console.log("testPUT() - RESPONSE: ", xmlhttp.responseText);
};

function DEBUGPOST(apiURL) {
    console.log("window.testPOST(" + apiURL + ")");

    xmlhttp = new XMLHttpRequest();

    xmlhttp.open("POST", apiURL + "/incidencia/1", false);
    //xmlhttp.setRequestHeader("Accept","application/json; charset=UTF-8");
    xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xmlhttp.send('{"id":"1","latitud":"2","longitud":"2","termino":"xmlhttp testPOST","accion":"xmlhttp testPOST"}');

    xmlhttp.open("GET", apiURL + "/incidencia/1", false);
    xmlhttp.send();
    console.log("testPUT() - RESPONSE: ", xmlhttp.responseText);
};