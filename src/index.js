const { pollAppStore } = require('./app-store-service');
const stars = (rating) => '⭐️'.repeat(rating);

pollAppStore()
    .subscribe(review => console.log(stars(review.rating) + '\n' + review.title + '\n' + review.body + '\n\n'));
