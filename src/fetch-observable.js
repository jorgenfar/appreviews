const fetch = require('isomorphic-fetch');
const { from } = require('rxjs');

const get = (url, options) => {
    return from(fetch(url, options)
        .then(res => res.json()
    ));
};

const post = (url, body, options) => {
    return from(fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-type': 'application/json',
        },
        ...options
    }));
};

module.exports = {
    get,
    post,
};
