const { Observable } = require('rxjs');

const { slackWebhookUrl } = require('../config.json');
const { isDev } = require('./util');
const { post } = require('./fetch-observable');

const postMessage = (message) => post(slackWebhookUrl, { text: message });

const log = (msg) => new Observable(observer => {
    console.log(msg);
    observer.complete();
});

module.exports = {
    postMessage: isDev() ? log : postMessage,
};