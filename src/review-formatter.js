const { appleIcon, androidIcon } = require('../config');
const { platFormDependentString } = require('./utils/platform-utils');

const stars = rating => '⭐️'.repeat(rating);

const formatTitle = review =>
    `${stars(review.rating)}${review.title ? ` - ${review.title}` : ''}`;

const formatReview = review => ({
    attachments: [
        {
            color: review.rating > 3 ? 'good' : (review.rating >= 2 ? 'warning' : 'danger'),
            author_name: review.userName,
            title: formatTitle(review),
            text: review.body,
            footer: `Versjon ${review.appVersion} - <${review.link}|${platFormDependentString(review.platform, 'Play', 'App')} Store>`,
            footer_icon: platFormDependentString(review.platform, androidIcon, appleIcon),
        }
    ]
});

module.exports = {
    formatReview,
};