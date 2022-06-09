# PorcFest Schedule

This uses the Google Sheets API and Gatsby. It was created with Node `v16.13.0`.

The Google Sheets is the publicly available [PorcFest schedule](https://docs.google.com/spreadsheets/d/1Xgr9ucp1JSXAG0TozNSWtIqhSTUrmjhDwygCKz4k_Qs).

## Getting started

See the prerequisites for a [Google Sheets API](https://developers.google.com/sheets/api/quickstart/nodejs) project, notably: create a Google Cloud Platform project for yourself, create the credentials, and download them to this project at `sheets/credentials.json`.

```
# Install the project dependencies
npm install

# Get data from the Google Sheet
npm run fetch-schedule

# Start Gatsby in development mode
npm run develop
```

## Deployment

Deployment is delegated to the `gh-pages` branch.

```
npm run deploy
```