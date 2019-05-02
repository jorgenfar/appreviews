require('dotenv').config();
const { map, flatMap } = require('rxjs/operators');

const { pollingIntervalMs } = require('../config');
const { postMessage } = require('./slack/slack-adapter');
const { formatReview } = require('./review-formatter');
const { pollAppStore } = require('./app-store/app-store-service');

pollAppStore(pollingIntervalMs).pipe(
    map(formatReview),
    flatMap(postMessage)
).subscribe(response => {
}, console.error);
