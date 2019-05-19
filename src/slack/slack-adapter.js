const { slackWebhookUrl } = require('../../config.json');
const { isDev } = require('../utils/dev-utils');
const { post } = require('../fetch-wrapper');
const { log } = require('../logger');

const postMessage = message => post(slackWebhookUrl, message);

const dryRun = (message) => new Promise((resolve) => {
    log(message);
    resolve();
  });

module.exports = {
  postMessage: isDev() ? dryRun : postMessage
};
