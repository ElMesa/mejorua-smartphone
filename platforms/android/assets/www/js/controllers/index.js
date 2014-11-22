var mejorua = mejorua || {};

$(document).ready(function() {

    mejorua.app = new mejorua.controllers.App();

    //TODO - REFACTOR - Move to a controller/header.js
    $('#navMain .navbar-collapse a').on('click', function() {
        if ($('#navMain .navbar-collapse').hasClass('in')) {
            console.log('.navbar-collapse.in a CKLICK');
            $("#navMain .navbar-toggle").click();
        }
    });

    //DEBUGPUT(mejorua.app.api.url);
    //DEBUGPOST(mejorua.app.api.url);
});

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