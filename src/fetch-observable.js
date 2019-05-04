const fetch = require('isomorphic-fetch');
const { from } = require('rxjs');

const { isDev } = require('./utils/dev-utils');

const get = (url, options) => {
    return from(wrappedFetch(url, options)
        .then(res => res.json()
    ));
};

const post = (url, body, options) => {
    return from(wrappedFetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-type': 'application/json',
        },
        ...options
    }));
};

const wrappedFetch = (url, options) => {
    return fetch(url, options)
        .then(res => {
            if (isDev()) {
                console.log(`${new Date()} FETCH ${url}: ${res.status} ${res.statusText}`);
            }
            return res;
        })
}

module.exports = {
    get,
    post,
};
