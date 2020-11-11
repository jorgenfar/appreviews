# Getting started

Install dependencies with `npm install`.

## Environment variables

The functions rely on environment variables for its configuration. The following variables are required for the code to run:
| Environment variable             | Example                                                       | Description                                       |
|:---------------------------------|:--------------------------------------------------------------|:--------------------------------------------------|
| APPREVIEWS_APPSTORE_APPID        | 123456789                                                     | The iOS App Store ID of the app                   |
| APPREVIEWS_PLAYSTORE_APPID       | com.example.myapp                                             | The Play Store ID of the app                      |
| APPREVIEWS_PLAYSTORE_CLIENT_ID   | 111111111111111111111                                         | The client ID of the PPlay Store API credentials  |
| APPREVIEWS_PLAYSTORE_PRIVATE_KEY | -----BEGIN PRIVATE KEY-----<contents>----END PRIVATE KEY----- | The private key of the Play Store API credentials |
| APPREVIEWS_SLACK_CHANNEL         | #my-appreview-channel                                         | The channel in which to post reviews              |
| APPREVIEWS_SLACK_TOKEN           | xoxb-123456789101-123456789101-ajduqiwksuajshduekqiaksq       | The token for accessing the Slack API             |


Additionally, the function uses the environment variable `ENVIRONMENT` to determine which DynamoDB tables it should use.
This should _only_ be set in a production environment. The tables names are:

| Environment | iOS Table Name          | Android table name          |
|:------------|:------------------------|:----------------------------|
| Production  | dbk_appreviews_ios      | dbk_appreviews_android      |
| Development | dbk_appreviews_ios_test | dbk_appreviews_android_test |


## Running locally
Run `node src/index.js` to do a dry-run of the code. This will get reviews from the app- and play store,
and persist their IDs to the test tables. It will log how many reviews would have been published had it been
run in a production environment.

## Running in production
The code runs in AWS Lambda, and is triggered by the schedule defined in `template.yml`.
The code can be manually triggered in the AWS Lambda console. 
