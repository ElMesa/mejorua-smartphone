var mejorua = mejorua || {};

$(document).ready(function() {

    mejorua.app = new mejorua.controllers.App();

    //testPUT(mejorua.app.api.url);
    //testPOST(mejorua.app.api.url);

    $('#pageRestClient').hide();

    $('.navbar-collapse.in a').on('click', function() {
        $(".navbar-toggle").click();
    });
});

function pageShowMap() {
    $('#pageRestClient').hide('slide', {
        direction: 'right'
    }, 500);
    $('#pageMap').delay(500).show('slide', {
        direction: 'left'
    }, 500);
}

function pageShowRestClient() {
    $('#pageMap').hide('slide', {
        direction: 'left'
    }, 500);
    $('#pageRestClient').delay(500).show('slide', {
        direction: 'right'
    }, 500);
}

function testPUT(apiURL) {
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

function testPOST(apiURL) {
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