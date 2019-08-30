/**
 * In order to create client_secret.json file, follow these steps:
 *
 * 1. Go to the Google APIs Console. (https://bit.ly/2IdMoPJ)
 * 2. Create a new project.
 * 3. Click Enable API. Search for and enable the Google Drive API.
 * 4. Create credentials for a Web Server(node.js) to access Application Data.
 * 5. Name the service account and grant it a Project Role of Editor.
 * 6. Download the JSON file.
 * 7. Copy the JSON file to your code directory and rename it to client_secret.json
 * 8. Find the client_email inside client_secret.json. Back in your spreadsheet,
 *    click the Share button in the top right, and paste the client email into
 *    the People field to give it edit rights. Hit Send.
 * 9. To install the Google Spreadsheet package: npm install google-spreadsheet@2.0.3
 *
 */
var jira = require('./jiraScript');
var github = require('./gitHubScript');
var sonar = require('./sonarQualityGate');

var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json');
var async = require('async');
var constants = require('./constants');

var sheet;
var cell;
var sheetTab = 0;
var column = process.argv[2].toUpperCase();
column = column.charCodeAt(0) - 64; // Converting Character to number.
// Create a document object using the ID of the spreadsheet : obtained from its URL.
var doc = new GoogleSpreadsheet(constants.SHEET_LINK);

const JQL = constants.JQL;
const sonarProject1 = constants.SONAR_PROJECT1_KEY;
const sonarProject2 = constants.SONAR_PROJECT2_KEY;

async.series([
        function setAuth(callback) {
            doc.useServiceAccountAuth(creds, callback);
        },

        function getInfoAndWorksheets(callback) {
            doc.getInfo(function (err, info) {
                console.log('Document '+ info.title + ' loading.....');
                sheet = info.worksheets[sheetTab];
                callback();
            });
        },
        function workingWithCells(callback) {
            sheet.getCells({
                'min-col': column,
                'max-col': column,
                'return-empty': true
            }, function (err, cells) {

                // Number of tickets for which code was written in the sprint
                jira.getJiraMetric(JQL.doneTicketsInSprint, "Done Issues")
                    .then(function (done) {
                        console.log("Done: " + done[0])
                        console.log("Story Points: " + done[1])
                        cells[0].value = process.argv[3];
                        cells[0].save();
                        cells[1].value = done[0];
                        cells[1].save();
                        cells[2].value = done[1];
                        cells[2].save();

                    // Total number of comments made on GITHUB in a sprint
                    github.getGitHubMetric(1, [])
                        .then(function (commentArray) {
                            console.log('3');
                            console.log("Comments array: " + commentArray)
                            cells[6].value = commentArray[0];
                            cells[6].save();
                            cells[8].value = commentArray[1].toString();
                            cells[8].save();
                            cells[9].value = commentArray[2].toString();
                            cells[9].save();
                            cells[10].value = commentArray[3].toString();
                            cells[10].save();
                            cells[11].value = '=IF(GCD(C9:C11) > 0,C9/GCD(C9:C11)&":"&C10/GCD(C9:C11)&":"&C11/GCD(C9:C11),0)';
                            cells[11].save();
                        })

                    github.getGitHubPR([])
                        .then(function (pushedTickets) {
                            console.log('4');
                            console.log("No of pushed tickets: " + pushedTickets);
                            cells[3].value = pushedTickets;
                            cells[3].save();
                            cells[4].value = pushedTickets;
                            cells[4].save();
                            cells[5].value = "=IF(C4 > 0, (C5/C4)*100, 0)";
                            cells[5].save();
                            cells[7].value = "=IF(C5 > 0, C7/C5, 0)";
                            cells[7].save();
                        })
                    });
                callback();
            });
        },
    ],
    function (err, results) {
        if (err) {
            console.log('Error: ' + err);
        }
    }
);
