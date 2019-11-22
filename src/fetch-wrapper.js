const fetch = require('isomorphic-fetch');

const wrappedFetch = (url, options = {}) => {
  return fetch(url, options).then(res => {
    console.log(`${url}: ${res.status}`);
    return res;
  }).catch(console.error);
};

const get = (url, options) => {
  return wrappedFetch(url, options).then(res => res.json());
};

const post = (url, body, options) => {
  return wrappedFetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    ...options
  });
};

module.exports = {
  get,
  post
};
