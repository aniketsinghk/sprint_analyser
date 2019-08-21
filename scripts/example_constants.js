// Substitute your values in the keys below and rename this file to
// constants.js for the application to work.

exports.GIT_REPO_AUTHOR = '';
exports.GIT_PROJECT = '';
exports.SONAR_PROJECT1_KEY = '';
exports.SONAR_PROJECT2_KEY = '';
exports.SHEET_LINK = '';
exports.GIT_HUB_COMMENT_TYPE = {
    typeAComment: '',
    typeBComment: '',
    typeCComment: '',
};
exports.JQL = {
    doneTicketsInSprint: "Sprint IN (" + process.argv[3] + ") AND issuetype IN " +
    "(Improvement, Story, Task) AND status IN " +
    "(Done, \"In Progress\", \"In QA\", Review)",
    storyPointsInSprint: "Sprint in (" + process.argv[3] + ") AND issuetype IN " +
    "(Improvement, Story, Task) AND status IN " +
    "(Done, \"In Progress\", \"In QA\", Review) AND \"Story Points\" > 1",
    reviewedTickets: "Sprint in (" + process.argv[3] + ") AND issuetype IN " +
    "(\"Code review sub-task\") AND status IN " +
    "(Done, \"In Progress\", \"In QA\", Review)"
};
exports.CREDENTIALS = {
    gitAccessKey: '',
    jiraUserName: '',
    jiraAccessKey: '',
    sonarQubeUsername: '',
    sonarQubeAccessKey: '',
    sonarQubePassword: ''
};
