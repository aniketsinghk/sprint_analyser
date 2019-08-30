# sprint_analyser
Tool to generate sprint-wise report


# Requirements
> node: v10.16.0

> npm: 6.9.0

# Setup
- Clone this repository. 
- Run the following command inside the cloned folder:
> npm install

- Create client_secret.json file, follow these steps:

    1. Go to the Google APIs Console. (https://bit.ly/2IdMoPJ)
    2. Create a new project.
    3. Click Enable API. Search for and enable the Google Drive API.
    4. Create credentials for a Web Server(node.js) to access Application Data.
    5. Name the service account and grant it a Project Role of Editor.
    6. Download the JSON file.
    7. Copy the JSON file to your code directory and rename it to client_secret.json
    8. Create a spreadsheet.
    9. Find the client_email inside client_secret.json. Back in your spreadsheet, click the Share button in the top right, and paste the client email into the People field to give it edit rights. Hit Send.
    10. To install the Google Spreadsheet package: npm install google-spreadsheet@2.0.3
- Rename ```example_constants.js``` to ```constants.js``` and insert your credentials.
- Copy the Spreadsheet Id from the link and assign it to ```SHEET_LINK``` inside ```constants.js```
 
# Examples
node <script_path> <column_name> <Sprint number> <fetch_github_comments_since>

node scripts/spreadsheet.js 'D' "'Sprint 44'" '2019-08-05T00:00:00Z'
