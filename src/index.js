require('dotenv').config();
const { map, flatMap, merge } = require('rxjs/operators');

const { pollingIntervalMs } = require('../config');
const { postMessage } = require('./slack/slack-adapter');
const { formatReview } = require('./review-formatter');
const { pollAppStore } = require('./app-store/app-store-service');
const { pollPlayStore } = require('./play-store/play-store-service');
const { error } = require('./logger');

pollAppStore(pollingIntervalMs).pipe(
    merge(pollPlayStore(pollingIntervalMs)),
    map(formatReview),
    flatMap(postMessage)
).subscribe(response => {
}, error);
