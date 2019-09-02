var constants = require('./constants');
var request = require('request');
var jira = require('./jiraScript'); 

var commentCount = 0;
var typeACount = 0;
var typeBCount = 0;
var typeCCount = 0;
const commentArray = [];
var pushedTickets = [];
var PRNo = [];
var reviewedTickets = 0;

const sinceDateTime = process.argv[4];
const gitCommentType = constants.GIT_HUB_COMMENT_TYPE;
const accessToken = constants.CREDENTIALS.gitAccessKey;

function _getOptions(pageNumber) {
    var url = "https://api.github.com/repos/" + constants.GIT_REPO_AUTHOR + "/" + constants.GIT_PROJECT +
        "/pulls/comments?page=" + pageNumber + "&since='" + sinceDateTime + "'";

    return {
        url: url,

        headers: {
            'User-Agent': 'request',
            Authorization: "token " + accessToken
        },
        method: 'GET',
    };
};

function _getOptionsCommits() {
    var url = "https://api.github.com/repos/" + constants.GIT_REPO_AUTHOR + "/" + constants.GIT_PROJECT +
        "/commits?since='" + sinceDateTime + "'";

    return {
        url: url,

        headers: {
            'User-Agent': 'request',
            Authorization: "token " + accessToken
        },
        method: 'GET',
    };
};

function _getOptionsPR() {
    var url = "https://api.github.com/repos/" + constants.GIT_REPO_AUTHOR + "/" + constants.GIT_PROJECT +
        "/pulls?state=all&base=sprint";

    return {
        url: url,

        headers: {
            'User-Agent': 'request',
            Authorization: "token " + accessToken
        },
        method: 'GET',
    };
};

function placeRequest(pageNumber, incomingJson, resolve) {
    request(_getOptions(pageNumber), function (error, response, body) {

        if (!error && response.statusCode === 200) {
            var currentPageJson = JSON.parse(body);

            for (var key in currentPageJson) {
                var commentBody = currentPageJson[key]['body'];
                var PrNumber = currentPageJson[key]['pull_request_url'].split("/").pop();
                if (!currentPageJson[key]['in_reply_to_id'] && PRNo.includes(parseInt(PrNumber))){
                    commentCount += 1;
                    if (commentBody.startsWith(gitCommentType.typeAComment)) {
                        typeACount++;
                    } else if (commentBody.startsWith(gitCommentType.typeBComment)) {
                        typeBCount++;
                    } else if (commentBody.startsWith(gitCommentType.typeCComment)) {
                        typeCCount++;
                    }
                }
            }

            var joinedRepos = incomingJson.concat(currentPageJson);

            if (response.headers.link) {
                var linkData = response.headers.link;
                if (!(linkData.includes('rel="next"'))) {
                    commentArray.push(commentCount, typeACount, typeBCount, typeCCount);
                    console.log("GITHUB metric 1 in order is: " + commentArray);
                    resolve(commentArray);
                } else {
                    pageNumber++;
                    placeRequest(pageNumber, joinedRepos, resolve);
                }
            } else {
                commentArray.push(commentCount, typeACount, typeBCount, typeCCount);
                console.log("GITHUB metric in order is: " + commentArray);
                resolve(commentArray);
            }
        } else {
            console.log('Some error occurred inside Github!');
        }
    });
}

function placeCommitsRequest(incomingJson, resolve) {
    request(_getOptionsCommits(), function (error, response, body) {

        if (!error && response.statusCode === 200) {
            var currentPageJson = JSON.parse(body);
 
            for (var key in currentPageJson) {
                var commitMessage = currentPageJson[key]['commit']['message'].trimLeft();
                if (commitMessage.startsWith("MSXDEV")){
                    var ticketNo = commitMessage.split(" ")[0];
                    if(!pushedTickets.includes(ticketNo) && jira.ticketsInSprint.includes(ticketNo)){
                        pushedTickets.push(ticketNo);
                    }
                } 
            }
            console.log("Pushed Tickets: " + pushedTickets);
            resolve(pushedTickets.length);
        } else {
            console.log('Some error occurred inside Github!');
        }
    });
}

function placePRRequest(incomingJson, resolve) {
    request(_getOptionsPR(), function (error, response, body) {

        if (!error && response.statusCode === 200) {
            var currentPageJson = JSON.parse(body);
            var reviewedUniqueTickets = [];
            for (var key in currentPageJson) {
                var commitTitle = currentPageJson[key]['title'].trimLeft();
                
                if (commitTitle.startsWith("MSXDEV")){
                    var ticketNo = commitTitle.split(" ")[0];
                    if(jira.ticketsInSprint.includes(ticketNo)){
                        PRNo.push(currentPageJson[key]["number"]);
                        if(currentPageJson[key]["merged_at"] != null && !reviewedUniqueTickets.includes(ticketNo)){
                            reviewedTickets += 1;
                            reviewedUniqueTickets.push(ticketNo);
                        }
                    }
                } 
            }
            console.log("PR No: " + PRNo);
            console.log("Reviwed Tickets:" + reviewedTickets);
            resolve(reviewedTickets);
        } else {
            console.log('Some error occurred inside Github!');
        }
    });
}

/**
 * This places a request to the GITHUB GET comments REST API.
 * getOptions() forms the URL and its required headers.
 * The access token is a persona access token generated from https://github.com/settings/tokens
 * @param pageNumber<number> This accepts and denoted what page number in API is to be called.
 * @param incomingJson<JSON> This accepts a JSON of the previous API page.
 */
function getGitHubMetric(pageNumber, incomingJson) {
    return new Promise(function (resolve, reject) {
        placeRequest(pageNumber, incomingJson, resolve);
    });
}

function getGitHubCommits(incomingJson) {
    return new Promise(function (resolve, reject) {
        placeCommitsRequest(incomingJson, resolve);
    });
}

function getGitHubPR(incomingJson) {
    return new Promise(function (resolve, reject) {
        placePRRequest(incomingJson, resolve);
    });
}

module.exports.getGitHubMetric = getGitHubMetric;
module.exports.getGitHubCommits = getGitHubCommits;
module.exports.getGitHubPR = getGitHubPR;
