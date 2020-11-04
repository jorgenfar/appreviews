const { post } = require('../fetch-wrapper');
const { formatReview } = require('./review-formatter');

const SLACK_POST_MESSAGE_URL = 'https://slack.com/api/chat.postMessage';
const token = process.env.APPREVIEWS_SLACK_TOKEN;
const slackChannel = process.env.APPREVIEWS_SLACK_CHANNEL;

const postReview = review =>
  post(
    SLACK_POST_MESSAGE_URL,
    {
      channel: slackChannel,
      ...formatReview(review)
    },
    {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  );

module.exports = {
  postReview
};
