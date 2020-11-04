const isProduction = () => process.env.ENVIRONMENT === 'PRODUCTION';

module.exports = {
  isProduction
};
