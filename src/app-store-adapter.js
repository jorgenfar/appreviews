const { flatMap } = require('rxjs/operators');
const { from } = require('rxjs');

const { fetchJsonObservable } = require('./fetch-json-observable');

const MOBILBANK_APPLE_APP_ID = 463742159;
const APP_STORE_RSS_FEED_URL = `https://itunes.apple.com/no/rss/customerreviews/id=${MOBILBANK_APPLE_APP_ID}/sortBy=mostRecent/json`;

const getAppStoreReviews = () =>
    fetchJsonObservable(APP_STORE_RSS_FEED_URL).pipe(
        flatMap(mapReviews)
    );

const mapReviews = (reviewResponse) => {
    const { feed: { entry: reviews } } = reviewResponse;
    const mappedReviews = reviews.map(review => ({
        id: review.id.label,
        userName: review.author.name.label,
        title: review.title.label,
        body: review.content.label,
        rating: review['im:rating'].label,
    }));
    // The RSS feed endpoint returns an array with the newest reviews first.
    // We reverse the response from the feed, so that the observable emits reviews in the order they were written.
    return from(mappedReviews.reverse());
};

module.exports = {
    getAppStoreReviews
};