"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/errorHub").configureLogging(signalR.LogLevel.Debug).build();

connection.start();


//var errorData = document.getElementById("BaseErrorData").value;

var errorDatas = [];

connection.on("InitErrors", function (errordatasinput) {
    errorDatas = errordatasinput;
    InitTable();
});

connection.on("ReceiveUpdate", function (errordata) {
    AddData(errordata);
});


function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function generateTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        for (let key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}


function InitTable() {

    let table = document.querySelector("table");
    let data = Object.keys(errorDatas[0]);
    generateTableHead(table, data);
    generateTable(table, errorDatas);
    $('table').excelTableFilter();
}

function AddData(errordata) {

    document.getElementById("table").deleteRow(document.getElementById("table").rows.length - 1);

    let table = document.querySelector("table");
    let row = table.insertRow(1);
    for (let key in errordata) {
        let cell = row.insertCell();
        let text = document.createTextNode(errordata[key]);
        cell.appendChild(text);
    }

    //$('table').excelTableFilter();
}




