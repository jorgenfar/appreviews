const { appStoreAppId } = require('../../config.json');
const { get } = require('../fetch-wrapper');
const { IOS } = require('../constants');
const { Review } = require('../review');

const APP_STORE_RSS_FEED_URL = `https://itunes.apple.com/no/rss/customerreviews/id=${appStoreAppId}/sortBy=mostRecent/json`; // eslint-disable-line max-len

const getReviews = () => get(APP_STORE_RSS_FEED_URL);

const mapReviews = reviewResponse => {
  const {
    feed: { entry: reviews = [] }
  } = reviewResponse;
  return reviews
    .map(
      review =>
        new Review({
          id: review.id.label,
          userName: review.author.name.label,
          title: review.title.label,
          body: review.content.label,
          rating: review['im:rating'].label,
          appVersion: review['im:version'].label,
          link: review.author.uri.label,
          platform: IOS
        })
    )
    .reverse();
};

const getAppStoreReviews = () => getReviews().then(mapReviews);

module.exports = {
  getAppStoreReviews
};
