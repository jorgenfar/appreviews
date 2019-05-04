const { appleIcon, androidIcon } = require('../config');
const { IOS, ANDROID } = require('./constants');

const stars = rating => '⭐️'.repeat(rating);

const platFormDependentString = (platform, androidVersion, iosVersion) => {
    if (platform === IOS) {
        return iosVersion;
    } else if (platform === ANDROID) {
        return androidVersion;
    } else {
        throw new Error('Unknown platform');
    }
};

const formatReview = review => ({
    attachments: [
        {
            color: review.rating > 3 ? 'good' : (review.rating >= 2 ? 'warning' : 'danger'),
            author_name: review.userName,
            title: `${stars(review.rating)} - ${review.title} `,
            text: review.body,
            footer: `Versjon ${review.appVersion} - <${review.link}|${platFormDependentString(review.platform, 'Play', 'App')} Store>`,
            footer_icon: platFormDependentString(review.platform, androidIcon, appleIcon),
        }
    ]
});

module.exports = {
    formatReview,
};