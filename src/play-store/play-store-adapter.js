const { google } = require('googleapis');

const apiKey = require('../../google-publisher.key.json');
const { playStoreAppId } = require('../../config.json');
const { Review } = require('../review');
const { ANDROID } = require('../constants');

const scopes = ['https://www.googleapis.com/auth/androidpublisher'];
const jwt = new google.auth.JWT(
  apiKey.client_id,
  null,
  apiKey.private_key,
  scopes,
  null
);

const getReviews = () =>
  jwt.authorize().then(() =>
    google.androidpublisher('v3').reviews.list({
      auth: jwt,
      packageName: playStoreAppId
    })
  );

const mapReviews = reviewResponse => {
  const {
    data: { reviews = [] }
  } = reviewResponse;
  return reviews
    .map(
      review =>
        new Review({
          id: review.reviewId,
          userName: review.authorName,
          // title: review.title.label,
          body: review.comments[0].userComment.text,
          rating: review.comments[0].userComment.starRating,
          appVersion: review.comments[0].userComment.appVersionName,
          link: `https://play.google.com/store/apps/details?id=${playStoreAppId}&reviewId=${
            review.reviewId
          }`,
          platform: ANDROID
        })
    )
    .reverse();
};

const getPlayStoreReviews = () => getReviews().then(mapReviews);

module.exports = {
  getPlayStoreReviews
};
