const debounce = require('lodash.debounce');

const { writeFile } = require('./utils/file-utils');

const debouncedPersist = debounce((fileName, data) => {
    writeFile(fileName, data)
        .subscribe(() => {}, console.error);
}, 1000);

class ReviewBuffer {
    constructor(name, size) {
        this.__fileName = `${process.cwd()}/${name}.persist.json`;
        this._size = size;
        
        try {
            this._arr = require(this.__fileName).ids;
        } catch (e) {
            this._arr = [];
        }
    }

    add(val) {
        if (this._arr.length >= this._size) {
            this._arr.shift();
        }
        this._arr.push(val);

        debouncedPersist(this.__fileName, JSON.stringify({
            ids: this._arr
        }));
    }


    contains(val) {
        return this._arr.includes(val);
    }
}

module.exports = {
    ReviewBuffer
};