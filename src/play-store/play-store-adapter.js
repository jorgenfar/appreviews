const { google } = require('googleapis');
const { from } = require('rxjs');
const { flatMap } = require('rxjs/operators');

const apiKey = require('../../google-publisher.key');
const { playStoreAppId } = require('../../config');
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

const authorize = from(jwt.authorize());
const getReviews = from(
  google.androidpublisher('v3').reviews.list({
    auth: jwt,
    packageName: playStoreAppId
  })
);

const mapReviews = reviewResponse => {
  const {
    data: { reviews = [] }
  } = reviewResponse;
  const mappedReviews = reviews.map(
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
  );
  // We reverse the response from the feed,
  // so that the observable emits reviews in the order they were written.
  return from(mappedReviews.reverse());
};

const getPlayStoreReviews = () =>
  authorize.pipe(
    flatMap(() => getReviews),
    flatMap(mapReviews)
  );

module.exports = {
  getPlayStoreReviews
};
