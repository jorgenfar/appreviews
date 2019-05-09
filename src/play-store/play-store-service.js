const { timer } = require('rxjs');
const { switchMap, tap, filter } = require('rxjs/operators');

const { getPlayStoreReviews } = require('./play-store-adapter');
const { ReviewBuffer } = require('../review-buffer');

const DEFAULT_PERIOD_MS = 60000;

const buffer = new ReviewBuffer('play_store', 500);

const pollPlayStore = (period = DEFAULT_PERIOD_MS) =>
  timer(0, period).pipe(
    switchMap(getPlayStoreReviews),
    filter(review => !buffer.contains(review.id)),
    tap(review => buffer.add(review.id))
  );

module.exports = {
  pollPlayStore
};
