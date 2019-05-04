class Review {
    constructor({ id, userName, title, body, rating, appVersion, link }) {
        this.id = id;
        this.userName = userName;
        this.title = title;
        this.body = body;
        this.rating = rating;
        this.appVersion = appVersion;
        this.link = link;
    }
}

module.exports = {
    Review
};