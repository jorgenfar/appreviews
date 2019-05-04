const stars = rating => '⭐️'.repeat(rating);

const formatReview = review => ({
    attachments: [
        {
            mrkdwn_in: ['text', 'pretext', 'title'],
            color: review.rating > 3 ? 'good' : (review.rating >= 2 ? 'warning' : 'danger'),
            author_name: review.userName,
            title: `${stars(review.rating)} - ${review.title} `,
            text: review.body,
            footer: `Versjon ${review.appVersion} - <${review.link}|App Store>`,
            footer_icon: 'https://emojis.slackmojis.com/emojis/images/1450319442/24/appleinc.png?1450319442',
        }
    ]
});

module.exports = {
    formatReview,
};