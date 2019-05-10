const { Observable } = require('rxjs');

const { slackWebhookUrl } = require('../../config.json');
const { isDev } = require('../utils/dev-utils');
const { log } = require('../logger');
const { post } = require('../fetch-observable');

const postMessage = message => post(slackWebhookUrl, message);

const dryRun = msg =>
  new Observable(observer => {
    log(msg);
    observer.complete();
  });

module.exports = {
  postMessage: isDev() ? dryRun : postMessage
};
