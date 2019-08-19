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
var sheetTab = process.argv[2];

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
                'min-col': 3,
                'max-col': 3,
                'return-empty': true
            }, function (err, cells) {

                // Number of tickets for which code was written in the sprint
                jira.getJiraMetric(JQL.doneTicketsInSprint, "Done Issues")
                    .then(function (done) {
                        console.log("Done: " + done)
                        cell = cells[1];
                        cell.value = done;
                        cell.save();
                    });

                // Number of tickets having story point greater than 1
                jira.getJiraMetric(JQL.storyPointsInSprint, "Story points greater than 1")
                    .then(function (spg1) {
                        console.log("Story points: " + spg1)
                        cell = cells[2];
                        cell.value = spg1;
                        cell.save();
                    });

                // Number of tickets for which review has been done
                jira.getJiraMetric(JQL.reviewedTickets, "Reviewed Tickets", "Reviewed")
                    .then(function (reviewed) {
                        console.log("Reviewed: " + reviewed)
                        cell = cells[3];
                        cell.value = reviewed;
                        cell.save();
                    });


                // Total number of comments made on GITHUB in a sprint
                github.getGitHubMetric(1, [])
                    .then(function (commentArray) {
                        console.log("Comments array: " + commentArray)
                        cells[5].value = commentArray[0];
                        cells[5].save();
                        cells[7].value = commentArray[1];
                        cells[7].save();
                        cells[8].value = commentArray[2];
                        cells[8].save();
                        cells[9].value = commentArray[3];
                        cells[9].save();
                        cells[11].value = 'Python , React';
                        cells[11].save();
                    })


                //Quality gate status
                sonar.getSonarQubeMetric(sonarProject1, 'alert_status')
                    .then(function (serverValue) {
                        console.log("Quality gate: " + serverValue)
                        sonar.getSonarQubeMetric(sonarProject2, 'alert_status')
                            .then(function (reactValue) {
                                console.log("Quality gate: " + reactValue)
                                var result = serverValue + " , " + reactValue;
                                cells[12].value = result;
                                cells[12].save();
                            })
                    })


                //Number of bugs
                sonar.getSonarQubeMetric(sonarProject1, 'bugs')
                    .then(function (serverValue) {
                        console.log("Bugs: " + serverValue)
                        sonar.getSonarQubeMetric(sonarProject2, 'bugs')
                            .then(function (reactValue) {
                                console.log("Bugs: " + reactValue)
                                var result = serverValue + " , " + reactValue;
                                cells[13].value = result;
                                cells[13].save();
                            })
                    })


                //Code Smells
                sonar.getSonarQubeMetric(sonarProject1, 'code_smells')
                    .then(function (serverValue) {
                        console.log("Code smells: " + serverValue)
                        sonar.getSonarQubeMetric(sonarProject2, 'code_smells')
                            .then(function (reactValue) {
                                console.log("Code smells: " + reactValue)
                                var result = serverValue + " , " + reactValue;
                                cells[14].value = result;
                                cells[14].save();
                            })
                    })


                //Duplicated lines %
                sonar.getSonarQubeMetric(sonarProject1, 'duplicated_lines_density')
                    .then(function (serverValue) {
                        console.log("Duplicated lines: " + serverValue)
                        sonar.getSonarQubeMetric(sonarProject2, 'duplicated_lines_density')
                            .then(function (reactValue) {
                                console.log("Duplicated lines: " + reactValue)
                                var result = serverValue + "% , " + reactValue + "%";
                                cells[15].value = result;
                                cells[15].save();
                            })
                    })

                // //Technical debt effort
                sonar.getSonarQubeMetric(sonarProject1, 'sqale_index')
                    .then(function (serverValue) {
                        console.log("Technical debt effort: " + serverValue)
                        sonar.getSonarQubeMetric(sonarProject2, 'sqale_index')
                            .then(function (reactValue) {
                                console.log("Technical debt effort: " + reactValue)
                                var serverValue2 = Math.ceil(serverValue / (8 * 60)) + ' day(s)';
                                var reactValue2 = Math.ceil(reactValue / (8 * 60)) + ' day(s)';
                                var result = serverValue2 + ", " + reactValue2 + "";
                                cells[16].value = result;
                                cells[16].save();
                            })
                    })

                //Reliability Rating
                sonar.getSonarQubeMetric(sonarProject1, 'reliability_rating')
                    .then(function (serverValue) {
                        console.log("Duplicated lines: " + serverValue)
                        sonar.getSonarQubeMetric(sonarProject2, 'reliability_rating')
                            .then(function (reactValue) {
                                console.log("Reliability Rating: " + reactValue)
                                var result = serverValue + " , " + reactValue + "";
                                cells[17].value = result;
                                cells[17].save();
                            })
                    })


                //Security Rating
                sonar.getSonarQubeMetric(sonarProject1, 'security_rating')
                    .then(function (serverValue) {
                        console.log("Security Rating: " + serverValue)
                        sonar.getSonarQubeMetric(sonarProject2, 'security_rating')
                            .then(function (reactValue) {
                                console.log("Security Rating: " + reactValue)
                                var result = serverValue + " , " + reactValue + "";
                                cells[18].value = result;
                                cells[18].save();
                            })
                    })


                // Tests coverage %
                sonar.getSonarQubeMetric(sonarProject1,'overall_coverage')
                    .then(function(serverValue){
                        console.log("Test coverage: " + serverValue)
                        sonar.getSonarQubeMetric(sonarProject2, 'overall_coverage')
                            .then(function (reactValue) {
                                console.log("Test coverage: " + reactValue)
                                var result = serverValue + " , " + reactValue + "";
                                cells[19].value = result;
                                cells[19].save();
                            })
                    })

                //Coverage on new code
                sonar.getSonarQubeMetric(sonarProject1,'new_coverage')
                    .then(function(serverValue){
                        console.log("Coverage on new code: " + serverValue)
                        sonar.getSonarQubeMetric(sonarProject2, 'new_coverage')
                            .then(function (reactValue) {
                                console.log("Coverage on new code: " + reactValue)
                                var result = serverValue + " , " + reactValue + "";
                                cells[20].value = result;
                                cells[20].save();
                            })
                    })

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
