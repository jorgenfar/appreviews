class Review {
    constructor({ id, userName, title, body, rating }) {
        this.id = id;
        this.userName = userName;
        this.title = title;
        this.body = body;
        this.rating = rating;
    }
}

module.exports = {
    Review
};