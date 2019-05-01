const stars = (rating) => '⭐️'.repeat(rating);

const formatReview = (review) => stars(review.rating) + '\n' + review.title + '\n' + review.body + '\n';

module.exports = {
    formatReview,
};