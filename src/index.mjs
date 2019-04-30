import { getAppStoreReviews } from "./app-store-adapter";

getAppStoreReviews().then(reviews => {
    reviews.forEach(console.log);
});