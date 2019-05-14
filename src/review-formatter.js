const { appleIcon, androidIcon } = require('../config');
const { platFormDependentString } = require('./utils/platform-utils');

const stars = rating => `${':star:️'.repeat(rating)}`;

const title = review =>
  `${stars(review.rating)}${review.title ? ` - ${review.title}` : ''}`;

const footer = review =>
  `Versjon ${review.appVersion} - <${review.link}|${platFormDependentString(
    review.platform,
    'Play',
    'App'
  )} Store>`;

const color = rating => {
  if (rating > 3) {
    return 'good';
  }
  if (rating >= 2) {
    return 'warning';
  }
  return 'danger';
};

const formatReview = review => ({
  attachments: [
    {
      color: color(review.rating),
      author_name: review.userName,
      title: title(review),
      text: review.body,
      footer: footer(review),
      footer_icon: platFormDependentString(
        review.platform,
        androidIcon,
        appleIcon
      )
    }
  ]
});

module.exports = {
  formatReview
};
