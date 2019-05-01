const fetch = require('isomorphic-fetch');
const rxjs = require('rxjs');

const fetchJson = (url, options) => {
    return rxjs.from(fetch(url, options)
        .then(res => res.json())
    );
};

module.exports = {
    fetchJson
};
