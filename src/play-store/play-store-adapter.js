const { google } = require('googleapis');

const apiKey = require('../../google-publisher.key.json');
const { playStoreAppId } = require('../../config.json');
const { Review } = require('../review');
const { ANDROID } = require('../constants');

const getDevice = review => {
  const { deviceMetadata } = review.comments[0].userComment;
  return `${deviceMetadata.manufacturer} ${deviceMetadata.productName}`;
};

const apiLevelToOsVersion = apiLevel => {
  const OS_VERSIONS = {
    19: '4.4 - 4.4.4',
    21: '5.0',
    22: '5.1',
    23: '6.0',
    24: '7.0',
    25: '7.1',
    26: '8.0.0',
    27: '8.1.0',
    28: '9',
    29: '10'
  };

  const osVersion = OS_VERSIONS[apiLevel];
  if (osVersion) {
    return `Android ${osVersion}`;
  }
  return 'unknown';
};

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
          body: review.comments[0].userComment.text,
          rating: review.comments[0].userComment.starRating,
          appVersion: review.comments[0].userComment.appVersionName,
          link: `https://play.google.com/store/apps/details?id=${playStoreAppId}&reviewId=${
            review.reviewId
          }`,
          device: getDevice(review),
          osVersion: apiLevelToOsVersion(
            review.comments[0].userComment.androidOsVersion
          ),
          platform: ANDROID
        })
    )
    .reverse();
};

const getPlayStoreReviews = () => getReviews().then(mapReviews);

module.exports = {
  getPlayStoreReviews
};
