require('dotenv').config();
const { map, flatMap } = require('rxjs/operators');

const { postMessage } = require('./slack/slack-adapter');
const { formatReview } = require('./review-formatter');
const { pollAppStore } = require('./app-store/app-store-service');

pollAppStore().pipe(
    map(formatReview),
    flatMap(postMessage)
).subscribe(response => {
    // Request went well?
}, error => {
    console.error(error);
});
