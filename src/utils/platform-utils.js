const { IOS, ANDROID } = require('../constants');

const platFormDependentString = (platform, androidString, iosString) => {
  if (platform === IOS) {
    return iosString;
  }
  if (platform === ANDROID) {
    return androidString;
  }
  throw new Error('Unknown platform');
};

module.exports = {
  platFormDependentString
};
