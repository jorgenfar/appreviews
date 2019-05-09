const timeStamp = () => Date();

const formatEntry = msg => `${timeStamp()}: ${msg}`;

const log = msg => console.log(formatEntry(msg));

const error = msg => console.error(formatEntry(msg));

module.exports = {
  log,
  error
};
