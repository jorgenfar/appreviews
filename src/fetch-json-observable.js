const fetch = require('isomorphic-fetch');
const rxjs = require('rxjs');

const fetchJsonObservable = (url, options) => {
    return rxjs.from(fetch(url, options)
        .then(res => res.json())
    );
};

module.exports = {
    fetchJsonObservable
};
