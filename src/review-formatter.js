const stars = rating => '⭐️'.repeat(rating);

const formatReview = review => ({
    channel: 'general',
    attachments: [
        {
            mrkdwn_in: ['text', 'pretext', 'title'],
            color: review.rating > 3 ? 'good' : (review.rating >= 2 ? 'warning' : 'danger'),
            author_name: review.userName,
            title: stars(review.rating),
            text: review.body,
            footer: 'footer'
        }
    ]
});

module.exports = {
    formatReview,
};