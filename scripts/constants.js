exports.GIT_REPO_AUTHOR = 'mpulsemobile';
exports.GIT_PROJECT = 'platform';
exports.SONAR_PROJECT1_KEY = 'catalog.adminServer';
exports.SONAR_PROJECT2_KEY = 'catalog.admin';
exports.SHEET_LINK = '1vnXo0goBqmrJLPyYYGPW66ZHwS7-BuY9ywdJofxZdFM';
exports.GIT_HUB_COMMENT_TYPE = {
    typeAComment: '#A',
    typeBComment: '#B',
    typeCComment: '#C',
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
    gitAccessKey: '6c3e7dcd6d042da8ce5b856ea95fdfa071ab6402',
    jiraUserName: 'aniket-quovantis',
    jiraAccessKey: 'i7Jkfu0y8pC2GZJ4uxLE5545',
    sonarQubeUsername: 'admin',
    sonarQubeAccessKey: 'c3cb126adedc682606cf9e8aea736f06a9f28ab1',
    sonarQubePassword: 'H@kun@M@t@t@'
};
