const { appleIcon, androidIcon } = require('../config');
const { platFormDependentString } = require('./utils/platform-utils');

const stars = rating => `${':star:️'.repeat(rating)}`;

const title = review =>
    `${stars(review.rating)}${review.title ? ` - ${review.title}` : ''}`;

const footer = review =>
    `Versjon ${review.appVersion} - <${review.link}|${platFormDependentString(review.platform, 'Play', 'App')} Store>`;

const formatReview = review => ({
    attachments: [
        {
            color: review.rating > 3 ? 'good' : (review.rating >= 2 ? 'warning' : 'danger'),
            author_name: review.userName,
            title: title(review),
            text: review.body,
            footer: footer(review),
            footer_icon: platFormDependentString(review.platform, androidIcon, appleIcon),
        }
    ]
});

module.exports = {
    formatReview,
};