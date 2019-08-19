var request = require('request');
var btoa = require('btoa');
var constants = require('./constants');

const ids = [];
const username = constants.CREDENTIALS.jiraUserName;
const apiToken = constants.CREDENTIALS.jiraAccessKey;
const sprint = process.argv[3];

function _getOptions(queryType) {
    var url = "https://unityinfluence.atlassian.net/rest/api/2/search" +
        "?jql=" + queryType;

    return {
        url: url,
        headers: {
            Authorization: "Basic " + btoa(username + ":" + apiToken),
            "Content-Type": "application/json"
        },

    };
};

function uniqueArray(value, index, self) {
    return self.indexOf(value) === index;
}

/**
 * This places a request to the JIRA search REST API in order to execute a query.
 * getOptions() forms the URL and its required headers. btoa() method is used for encoding a string in base-64 format.
 * apiToken parameter is a JIRA API token that you can generate from https://id.atlassian.com/manage/api-tokens
 * @param queryType<string> This accepts the query to be run from the file constants.
 * @param message<string> This accepts the message to be print in case of success/ failure.
 * @param type<string> This checks whether the query type is Reviewed.
 */
function getJiraMetric(queryType, message, type) {
    return new Promise(function (resolve, reject) {

        request(_getOptions(queryType), function (error, response, body) {
            if (!error && response.statusCode === 200) {

                var parsedJson = JSON.parse(body);
                var count = parsedJson['total'];

                if (count === 0) {
                    console.log("No " + message + " in " + sprint)
                }
                if (type === 'Reviewed') {

                    if (!parsedJson.issues[0]) {
                        console.log("No Code Review sub-tasks created in the sprint!")
                        resolve(0);
                    } else if (parsedJson.issues[0].fields.parent) {
                        for (i = 0; i < count; i++) {
                            ids.push(parsedJson.issues[i].fields.parent.key);
                        }
                        var unique = ids.filter(uniqueArray);
                        resolve(unique.length);
                    }

                } else {
                    resolve(count);
                }
            } else {
                console.log('Some error occurred!');
            }

        });
    })
}

module.exports.getJiraMetric = getJiraMetric;

