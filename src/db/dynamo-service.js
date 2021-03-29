const moment = require("moment");
const AWS = require('aws-sdk');
const { isProduction } = require('../utils/env-utils');

AWS.config.update({
  region: 'eu-central-1'
});

const TableNames = {
  IOS: isProduction() ? 'dbk_appreviews_ios' : 'dbk_appreviews_ios_test',
  ANDROID: isProduction()
    ? 'dbk_appreviews_android'
    : 'dbk_appreviews_android_test'
};

const client = new AWS.DynamoDB.DocumentClient();

const getReviews = async tableName => {
  const params = {
    TableName: tableName
  };

  try {
    const response = await client.scan(params).promise();
    return response.Items;
  } catch (error) {
    console.error(`Failed to get reviews from ${tableName}`, error);
    return [];
  }
};

function splitArrayIntoChunksOfLen(arr, len) {
  const chunks = [];
  let i = 0;
  const n = arr.length;
  while (i < n) {
    chunks.push(arr.slice(i, (i += len)));
  }
  return chunks;
}

const putReviews = async (tableName, reviews) => {
  // DynamoDB.batchWrite can write at most 25 items at once
  const chunkedReviews = splitArrayIntoChunksOfLen(reviews, 25);
  try {
    await Promise.all(
      chunkedReviews.map(async chunk => {
        const reviewsParams = chunk.map(review => ({
          PutRequest: {
            Item: {
              id: review.id,
              timestamp: moment().valueOf()
            }
          }
        }));

        const params = {
          RequestItems: {
            [tableName]: reviewsParams
          }
        };

        return client.batchWrite(params).promise();
      })
    );
  } catch (error) {
    console.error('Could not write reviews to dynamodb', error);
  }
};

module.exports = {
  getReviews,
  putReviews,
  TableNames
};
