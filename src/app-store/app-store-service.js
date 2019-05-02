const { timer } = require('rxjs/index');
const { switchMap, tap, filter } = require('rxjs/operators/index');

const { getAppStoreReviews } = require('./app-store-adapter');
const { ReviewBuffer } = require('../review-buffer');

const DEFAULT_PERIOD_MS = 60000;

const buffer = new ReviewBuffer('app_store', 500);

const pollAppStore = (period = DEFAULT_PERIOD_MS) => timer(0, period).pipe(
    switchMap(getAppStoreReviews),
    filter(review => !buffer.contains(review.id)),
    tap(review => buffer.add(review.id))
);

module.exports = {
    pollAppStore
};