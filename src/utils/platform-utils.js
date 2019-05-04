const { IOS, ANDROID } = require('../constants');

const platFormDependentString = (platform, androidString, iosString) => {
    if (platform === IOS) {
        return iosString;
    } else if (platform === ANDROID) {
        return androidString;
    } else {
        throw new Error('Unknown platform');
    }
};

module.exports = {
    platFormDependentString
};