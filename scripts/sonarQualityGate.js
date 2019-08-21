var request = require('request');
var btoa = require('btoa')
var constants = require('./constants');

const username = constants.CREDENTIALS.sonarQubeUsername;
const password = constants.CREDENTIALS.sonarQubePassword;
// const accessKey = constants.CREDENTIALS.sonarQubeAccessKey;

function _getOptions(projectKey, metricType)
{
    var url = "https://jenkins.unityinfluence.com/sonar/api/measures/component?" +
        "componentKey=" + projectKey + "&metricKeys=" + metricType
    return {
        url: url,
        headers: {
            Authorization: "Basic " + btoa(username + ":" + password),
            "Content-Type": "application/json"
        },
    };
};


function getSonarQubeMetric(projectKey, metricType) {

    return new Promise(function(resolve, reject) {

        request(_getOptions(projectKey, metricType), function (error, response, body) {
            console.log("Status code " + response.statusCode)
            if (!error && response.statusCode === 200) {

                var parsedJson = JSON.parse(body);
                if(!parsedJson['component']['measures'][0]){
                    console.log("Metric not found!")
                    return false
                }
                var value = parsedJson['component']['measures'][0]['value'];
                resolve(value);
            }

            else {
                console.log('Some error occurred inside Sonar!');
            }

        });
    })
}

module.exports.getSonarQubeMetric = getSonarQubeMetric;

