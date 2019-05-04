const { flatMap } = require('rxjs/operators/index');
const { from } = require('rxjs/index');

const { appStoreAppId  } = require('../../config');
const { get } = require('../fetch-observable');
const { IOS } = require('../constants');
const { Review } = require('../review');

const APP_STORE_RSS_FEED_URL = `https://itunes.apple.com/no/rss/customerreviews/id=${appStoreAppId}/sortBy=mostRecent/json`;

const getAppStoreReviews = () =>
    get(APP_STORE_RSS_FEED_URL).pipe(
        flatMap(mapReviews)
    );

const mapReviews = (reviewResponse) => {
    const { feed: { entry: reviews = [] } } = reviewResponse;
    const mappedReviews = reviews.map(review => new Review({
        id: review.id.label,
        userName: review.author.name.label,
        title: review.title.label,
        body: review.content.label,
        rating: review['im:rating'].label,
        appVersion: review['im:version'].label,
        link: review.author.uri.label,
        platform: IOS
    }));
    // The RSS feed endpoint returns an array with the newest reviews first.
    // We reverse the response from the feed, so that the observable emits reviews in the order they were written.
    return from(mappedReviews.reverse());
};

module.exports = {
    getAppStoreReviews
};