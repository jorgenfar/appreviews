const flatten = require('lodash.flatten');

const { pollingIntervalMs } = require('../config.json');
const { postMessage } = require('./slack/slack-adapter');
const { formatReview } = require('./review-formatter');
const {
  getAppStoreReviewsToPublish
} = require('./app-store/app-store-service');
const {
  getPlayStoreReviewsToPublish
} = require('./play-store/play-store-service');

setInterval(async () => {
  const reviewsToPublish = await Promise.all([
    getAppStoreReviewsToPublish(),
    getPlayStoreReviewsToPublish()
  ]).then(flatten);

  const formattedReviews = reviewsToPublish.map(formatReview);
  formattedReviews.forEach(postMessage);
}, pollingIntervalMs);
