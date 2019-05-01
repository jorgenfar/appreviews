const stars = (rating) => '⭐️'.repeat(rating);

const bold = (text) => `*${text}*`;

const italic = (text) => `_${text}_`;

const indentBlock = (text) => `>>>${text}`;

const formatReview = (review) =>
    `${stars(review.rating)} ${italic(review.userName)}` +
    '\n' + bold(review.title) +
    '\n' + indentBlock(review.body) +
    '\n';

module.exports = {
    formatReview,
};