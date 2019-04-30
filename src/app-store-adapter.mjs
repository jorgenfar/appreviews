import operators from 'rxjs/operators';

import { fetchJson } from './http-client';

const MOBILBANK_APPLE_APP_ID = 463742159;
const APP_STORE_RSS_FEED_URL = `https://itunes.apple.com/no/rss/customerreviews/id=${MOBILBANK_APPLE_APP_ID}/sortBy=mostRecent/json`;

export const getAppStoreReviews = () =>
    fetchJson(APP_STORE_RSS_FEED_URL)
        .pipe(operators.map(mapReviews));

const mapReviews = (reviewResponse) => {
    const { feed: { entry: reviews } } = reviewResponse;
    return reviews.map(review => ({
        id: review.id.label,
        userName: review.author.name.label,
        title: review.title.label,
        body: review.content.label,
        rating: review['im:rating'].label,
    }));
};
