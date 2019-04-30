import fetch from 'isomorphic-fetch';
import rxjs from 'rxjs';

export const fetchJson = (url, options) => {
    return new rxjs.from(fetch(url, options)
        .then(res => res.json())
    );
};
