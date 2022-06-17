import fs from 'fs';
import fse from 'fs-extra';
import readline from 'readline';
import { google } from 'googleapis';
import * as R from 'ramda';
import { DateTime } from 'luxon';
import { config } from './config.js';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'sheets/token.json';

// Load client secrets from a local file.
fs.readFile('sheets/credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), writeSchedule);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

// processData :: [][]String -> []{}
// processData takes sheets data (array of arrays of strings) and returns an
// array of objects (JSON) with the first array in the sheets data used as the
// keys in each object of the return value.
function processData(data) {
  // dataKeys :: []string
  // The first row of the sheets data will be the headers of the columns.
  // shift() will remove (mutate!) the first element from the sheets data and
  // store the value in dataKeys.
  const dataKeys = data.shift();

  const allDataWithKeys = R.map(d => R.zipObj(dataKeys, d), data);
  const dataWithoutEmptyRows = R.filter(row => R.not(R.isEmpty(row)), allDataWithKeys);

  return dataWithoutEmptyRows;
}

// sortByTime takes an arry of objects with a Date key as a string, transforms
// the strings to dates, sorts by dates, and transforms back to strings
//
// example expected input
// [
//   {
//     Date: 'Tue  3:00PM',
//     'Duration (Minutes)': '120',
//     Title: 'The Unknown History of This Movement of Ours',
//     Lead: 'Jack Shimek',
//     Location: 'FS: RV13 Anarchy',
//     Link: 'https://porcfest.com/2022/06/08/detailed-schedule-for-pf2022#108'
//   },
//   ..
// ]
function sortByTime(data) {
  const outputSpecifier = 'ccc t';
  const doubleSpacedSpecifier = 'ccc  h:mma'
  const dateToString = t => t.toFormat(outputSpecifier);
  const doubleSpacedConverter = t => DateTime.fromFormat(t, doubleSpacedSpecifier)

  const convertToDate = R.map(d => {
    const date = doubleSpacedConverter(d.Date);
    
    return {
      ...d,
      Date: date,
    }
  });

  const convertToString = R.map(d => ({
    ...d,
    Date: dateToString(d.Date),
  }));

  const sortByDateComparison = R.sortBy(R.prop('Date'));

  const getDataSortedByTime = R.pipe(
    convertToDate,
    sortByDateComparison,
    convertToString
  );

  return getDataSortedByTime(data);
}

// writeData :: Record -> Void
// writeData takes a Google Auth record and writes the data from the sheet to
// a json file.
function writeSchedule(auth) {
  const sheets = google.sheets({ version: 'v4', auth });

  sheets.spreadsheets.values.get(
    {
      spreadsheetId: config.sheets.id,
      range: config.sheets.range
    },
    (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);

      const { data } = res;

      const zippedData = processData(data.values);
      const sortedByDateTime = sortByTime(zippedData);
      const jsonData = JSON.stringify(sortedByDateTime);

      fse.outputFile(config.sheets.outputPath, jsonData, 'utf8', error =>
        console.error(error)
      );
    }
  );
}