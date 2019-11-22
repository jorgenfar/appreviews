const flatten = require('lodash.flatten');

const { pollingIntervalMs } = require('../config.json');
const { postReview } = require('./slack/slack-adapter');
const {
  getAppStoreReviewsToPublish
} = require('./app-store/app-store-service');
const {
  getPlayStoreReviewsToPublish
} = require('./play-store/play-store-service');

const looper = async () => {
  const reviewsToPublish = await Promise.all([
    getAppStoreReviewsToPublish(),
    getPlayStoreReviewsToPublish()
  ])
    .then(flatten)
    .catch(console.error);

  try {
    if (reviewsToPublish) {
      reviewsToPublish.forEach(postReview);
    }
  } catch (e) {
    console.error(e);
  }
};

const main = () => {
  looper();
  setTimeout(looper, pollingIntervalMs);
};

main();
