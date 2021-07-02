"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/errorHub").configureLogging(signalR.LogLevel.Debug).build();

connection.start();

var errorDatas = [];
var fieldEl = document.getElementById("filter-field");
var typeEl = document.getElementById("filter-type");
var valueEl = document.getElementById("filter-value");


connection.on("InitErrors", function (errordatasinput) {
    errorDatas = errordatasinput;
    for (let errorData of errorDatas) {
        errorData.time = FormatDataTime(errorData.time);
        errorData = AddLink(errorData);
    }
    InitTable();
});

connection.on("ReceiveUpdate", function (errordata) {
    errordata = AddLink(errordata);
    errordata.time = FormatDataTime(errordata.time);
    table.addData(errordata);
    table.refreshFilter();
});


var table = new Tabulator();


function GenerateTableHead() {
    var tableHeads = [];
    tableHeads.push({ title: "Application Name", field: "application_name", visible: false});
    tableHeads.push({ title: "Chain", field: "chain", visible: false});
    tableHeads.push({ title: "Current Working Directory", field: "cwd", visible: false});
    tableHeads.push({ title: "File name", field: "file_name", visible: false});
    tableHeads.push({ title: "Function name", field: "function_name", responsive: 0});
    tableHeads.push({ title: "Group hash", field: "group_hash", visible: false});
    tableHeads.push({ title: "Host name", field: "host_name", responsive: 1});
    tableHeads.push({ title: "Issue name", field: "issue_name", responsive: 1});
    tableHeads.push({ title: "Line number", field: "line_number", visible: false});
    tableHeads.push({ title: "Message", field: "message", responsive: 2});
    tableHeads.push({ title: "Package name", field: "package_name", visible: false});
    tableHeads.push({ title: "Parameters", field: "parameters", visible: false});
    tableHeads.push({ title: "Partition", field: "partition", visible: false});
    tableHeads.push({ title: "Process ID", field: "process_id", visible: false});
    tableHeads.push({ title: "Qualifiers", field: "qualifiers", visible: false});
    tableHeads.push({ title: "Severity", field: "severity", responsive: 1});
    tableHeads.push({ title: "Thread ID", field: "thread_id", visible: false});
    tableHeads.push({ title: "Time", field: "time", responsive: 0});
    tableHeads.push({ title: "Time from epoch", field: "usecs_since_epoch", visible: false});
    tableHeads.push({ title: "User ID", field: "user_id", visible: false});
    tableHeads.push({ title: "User name", field: "user_name", responsive: 1});
    tableHeads.push({ title: "Details", field: "details", formatter: "link", formatterParams: { label: "Details" }, responsive: 0})
    return tableHeads;
}

//Initialise first the table
function InitTable() {
    table = new Tabulator("#table", {
        responsiveLayout: true,
        height: "800px",
        pagination: "local",
        paginationSize: 30,
        layout: "fitDataTable",
        addRowPos: "bottom",
        columns: GenerateTableHead(),
        initialSort: [
            { column: "time", dir: "desc" }
        ]
    });
    table.setData(errorDatas);
}


//Custom filter example
function customFilter(data) {
    return data.car && data.rating < 3;
}

var filters = [];

//Trigger setFilter function with correct parameters
document.getElementById("filter-apply").addEventListener("click", function () {

    var filterValue = document.getElementById("filter-value").value;
    var filterVariable = document.getElementById("filter-field").value;
    var filterType = document.getElementById("filter-type").value;

    filters.push({ field: filterVariable, type: filterType, value: filterValue });

    table.setFilter(filters);

});

//Clear filters on "Clear Filters" button click
document.getElementById("filter-clear").addEventListener("click", function () {
    fieldEl.value = "";
    typeEl.value = "=";
    valueEl.value = "";

    filters = [];

    table.clearFilter();
});

function AddLink(errorData) {
    errorData.details = "ErrorReports/details/" + errorData.id;
    return errorData;
}

function FormatDataTime(errorDataTime) {
    errorDataTime = new Date(errorDataTime).toLocaleString();
    return errorDataTime;
}





















