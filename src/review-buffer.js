class ReviewBuffer {
    constructor(size) {
        this._size = size;
        this._arr = [];
    }

    add(val) {
        if (this._arr.length >= this._size) {
            this._arr.shift();
        }
        this._arr.push(val);
    }


    contains(val) {
        return this._arr.includes(val);
    }
}

module.exports = {
    ReviewBuffer
};