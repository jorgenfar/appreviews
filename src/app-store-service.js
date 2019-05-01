const { timer } = require('rxjs');
const { switchMap, tap, filter } = require('rxjs/operators');

const { getAppStoreReviews } = require('./app-store-adapter');
const { ReviewBuffer } = require('./review-buffer');

const DEFAULT_PERIOD = 10000;

let buffer = new ReviewBuffer(50);

const pollAppStore = (period = DEFAULT_PERIOD) => timer(0, period).pipe(
    switchMap(getAppStoreReviews),
    filter(review => !buffer.contains(review.id)),
    tap(review => buffer.add(review.id))
);

module.exports = {
    pollAppStore
};