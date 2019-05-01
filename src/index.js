require('dotenv').config();
const { map } = require('rxjs/operators');

const { postMessage } = require('./slack-adapter');
const { formatReview } = require('./review-formatter');
const { pollAppStore } = require('./app-store-service');

pollAppStore().pipe(
    map(formatReview),
    map(postMessage)
).subscribe(console.log);
