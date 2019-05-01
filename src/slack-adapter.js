const { post } = require('./fetch-observable');

const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';

const postMessage = (message) => post(SLACK_WEBHOOK_URL, { text: message });

module.exports = {
    postMessage,
};