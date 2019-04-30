import fetch from 'isomorphic-fetch';

export const fetchJson = async (url, options) => {
    const response = await fetch(url, options);
    return response.json();
};
