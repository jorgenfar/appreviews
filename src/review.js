class Review {
    constructor({ id, userName, title, body, rating, appVersion, link, platform }) {
        this.id = id;
        this.userName = userName;
        this.title = title;
        this.body = body;
        this.rating = rating;
        this.appVersion = appVersion;
        this.link = link;
        this.platform = platform;
    }
}

module.exports = {
    Review
};