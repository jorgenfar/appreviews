const { platFormDependentString } = require('../utils/platform-utils');

const appleIcon =
  'https://emojis.slackmojis.com/emojis/images/1450319442/24/appleinc.png?1450319442';
const androidIcon =
  'https://emojis.slackmojis.com/emojis/images/1493026598/2124/android.png?1493026598';

const stars = rating => `${':star:️'.repeat(rating)}`;

const title = review =>
  `${stars(review.rating)}${review.title ? ` - ${review.title}` : ''}`;

const footer = review =>
  `Appversjon ${review.appVersion}${platFormDependentString(
    review.platform,
    ` - ${review.osVersion}`,
    ''
  )}${platFormDependentString(review.platform, ` - ${review.device}`, '')} - <${
    review.link
  }|${platFormDependentString(review.platform, 'Play', 'App')} Store>`;

const COLORS = {
  1: 'a30200',
  2: 'daa038',
  3: 'ffcc00',
  4: '8bb72c',
  5: '009e60'
};

const formatReview = review => ({
  attachments: [
    {
      color: COLORS[review.rating],
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
