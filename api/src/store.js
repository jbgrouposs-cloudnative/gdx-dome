const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_DEFAULT_REGION });
const proxyHost = process.env.NODE_PROXY_HOST;
const proxyPort = process.env.NODE_PROXY_PORT;
if (proxyHost && proxyPort) {
  const proxy = require('proxy-agent');
  const proxyUri = 'http://' + proxyHost + ':' + proxyPort;
  AWS.config.update({
    httpOptions: { agent: proxy(proxyUri) }
  });
  console.log('setup proxy=' + proxyUri);
}

const documentClient = new AWS.DynamoDB.DocumentClient();

async function getServiceList() {
  const result = await documentClient
    .scan({ TableName: 'GDXDomeDynamoDB' })
    .promise();
  return result;
}

async function getService(providerId, objectType) {
  console.log('providerId = ' + providerId);
  const value = await documentClient
    .get(
      {
        TableName: 'GDXDomeDynamoDB',
        Key: {
          provider: providerId,
          object: objectType
        }
      },
      (err, data) => {
        console.log('documentClient res');
        if (err) {
          console.error(err);
          return err;
        }
        console.log(data);
        return data;
      }
    )
    .promise();
  return value;
}

async function saveService(service) {
  console.log(service);
  const result = await documentClient
    .put({
      TableName: 'GDXDomeDynamoDB',
      Item: service
    })
    .promise();
  return result;
}

async function removeService(providerId) {
  console.log(providerId);
  const result = await documentClient
    .delete({
      TableName: 'GDXDomeDynamoDB',
      Key: {
        provider: providerId,
        object: 'ENDPOINT'
      }
    })
    .promise();
  return result;
}

module.exports = {
  getServiceList,
  getService,
  saveService,
  removeService
};
