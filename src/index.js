const { pollAppStore } = require('./app-store-service');

pollAppStore()
    .subscribe(review => console.log(review.body + '\n\n\n'));