# Getting started

`pm2` is used to run the bot. Install `pm2` with the command:
```
npm i -g pm2
```

Install dependencies with `npm install`.

# Developing

Run `npm run dev`, and go to `chrome://inspect`. There you should see the node debugger listed.

# Running

Fill in `config.json` with APP ids.

Then, the app needs two key files copied into its working directory:

## Google Publisher API

Download an API key (in JSON format) for the Google publisher API from a Google Play account that is an administrator of Play Store app ID filled in to `config.json`.
Save the JSON file as `google-publisher.key.json`.

## Slack

Create a file named `slack.key.json`, and create a JSON object in it with the key `token`, and give it your Bot User OAuth Access Token as a value.
