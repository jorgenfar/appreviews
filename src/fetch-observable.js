const fetch = require('isomorphic-fetch');
const { from } = require('rxjs');

const { isDev } = require('./utils/dev-utils');
const { log } = require('./logger');

const wrappedFetch = (url, options = {}) => {
  const verb = options.method || 'GET';
  return fetch(url, options).then(res => {
    if (isDev()) {
      log(`${verb} ${url}, ${res.status} ${res.statusText}`);
    }
    return res;
  });
};

const get = (url, options) => {
  return from(wrappedFetch(url, options).then(res => res.json()));
};

const post = (url, body, options) => {
  return from(
    wrappedFetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json'
      },
      ...options
    })
  );
};

module.exports = {
  get,
  post
};
