"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/errorHub").configureLogging(signalR.LogLevel.Debug).build();

connection.start();

var errorDatas = [];
var fieldEl = document.getElementById("filter-field");
var typeEl = document.getElementById("filter-type");
var valueEl = document.getElementById("filter-value");
var activeFiltersDiv = document.getElementById('activeFilters');


connection.on("InitErrors", function (errordatasinput) {
    errorDatas = errordatasinput;
    for (let errorData of errorDatas) {
        errorData.time = FormatDataTime(errorData.time);
        errorData = AddLink(errorData);
    }
    InitTable();
    PrintPlots();
}); 


connection.on("ReceiveUpdate", function (errordata) {
    errordata = AddLink(errordata);
    errorDatas.push(errordata);
    errordata.time = FormatDataTime(errordata.time);
    table.addData(errordata);
    table.refreshFilter();
    PrintPlots();
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
        groupBy: "group_hash",
        groupHeader: function (value, count, data, group) {
            //value - the value all members of this group share
            //count - the number of rows in this group
            //data - an array of all the row data objects in this group
            //group - the group component for the group

            var topIssue = data.find(x => x.chain == 0);

            switch (topIssue.severity) {
                case "WARNING":
                    return "<span style='color:#FFFF66; margin-left:10px;'>" + topIssue.function_name + " - " + topIssue.issue_name + " - " + topIssue.time + " (" + count + " item)</span>";
                    break;
                case "ERROR":
                    return "<span style='color:#FF9966; margin-left:10px;'>" + topIssue.function_name + " - " + topIssue.issue_name + " - " + topIssue.time + " (" + count + " item)</span>";
                    break;
                case "FATAL":
                    return "<span style='color:#FF0000; margin-left:10px;'>" + topIssue.function_name + " - " + topIssue.issue_name + " - " + topIssue.time + " (" + count + " item)</span>";
                    break;
                default:
                    return "<span style='color:#000000; margin-left:10px;'>" + topIssue.function_name + " - " + topIssue.issue_name + " - " + topIssue.time + " (" + count + " item)</span>";

            }

        },


        rowFormatter: function (row) {
            switch (row.getData().severity) {
                case "WARNING":
                    row.getElement().style.backgroundColor = "#FFFF66";
                    break;
                case "ERROR":
                    row.getElement().style.backgroundColor = "#FF9966";
                    break;
                case "FATAL":
                    row.getElement().style.backgroundColor = "#FF0000";
                    break;

            }
            
        },
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

    activeFiltersDiv.innerHTML += "<br>" +filterVariable + " " + filterType + " " + filterValue;
});

//Clear filters on "Clear Filters" button click
document.getElementById("filter-clear").addEventListener("click", function () {
    fieldEl.value = "";
    typeEl.value = "=";
    valueEl.value = "";

    filters = [];

    table.clearFilter();

    activeFiltersDiv.innerHTML = "";
});




function AddLink(errorData) {
    errorData.details = "ErrorReports/details/" + errorData.id;
    return errorData;
}

function FormatDataTime(errorDataTime) {
    errorDataTime = new Date(errorDataTime).toLocaleString();
    return errorDataTime;
}


function PrintPlots() {

    var pieData = PieData("severity");

    Plotly.newPlot('chartPlaceholderPie', pieData);

    var histoData = HistoData();

    Plotly.newPlot('chartPlaceholderFrequency', histoData);

    var histoData = PieData("function_name");

    Plotly.newPlot('chartPlaceholderFunction', histoData);

    var histoData = PieData("host_name");

    Plotly.newPlot('chartPlaceholderHost', histoData);

    var histoData = PieData("issue_name");

    Plotly.newPlot('chartPlaceholderIssue', histoData);
}

function PieData(filterKey) {


    const errorDatasTypeCounts = errorDatas.reduce((counts, item) => {
        if (counts[item[filterKey]] === undefined) counts[item[filterKey]] = 0;
        counts[item[filterKey]]++;
        return counts;
    }, {});


    var data = [{
        values: Object.values(errorDatasTypeCounts),
        labels: Object.keys(errorDatasTypeCounts),
        type: 'pie'
    }];

    return data
}


function HistoData() {


    const errorDatasTypeCounts = errorDatas.reduce((counts, item) => {
        if (counts[item.severity] === undefined) counts[item.severity] = 0;
        counts[item.severity]++;
        return counts;
    }, {});

    var values = [];

    for (let key of Object.keys(errorDatasTypeCounts)) {
        var errorDatasWithKeys = errorDatas.filter(x => x.severity == key);
        errorDatasWithKeys = errorDatasWithKeys.sort((a, b) => a.time.localeCompare(b.time));

        var xAxis = [];
        var yAxis = [];
        var i = 0;
        for (let errorDatasWithKey of errorDatasWithKeys) {
            xAxis.push(errorDatasWithKey.time);
            yAxis.push(++i);
        }

        var trace = {
            x: xAxis,
            y: yAxis,
            mode: 'lines',
            name: key,
            type: 'scatter'
        };

        values.push(trace);
    }

    return values;
}


















