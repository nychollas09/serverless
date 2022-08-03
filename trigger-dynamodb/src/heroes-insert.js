const { randomUUID } = require("crypto");

class Handler {
  constructor({ dynamoDb }) {
    this.dynamoDb = dynamoDb;
    this.dynamoDbTable = process.env.DYNAMODB_TABLE;
  }

  prepareData(data) {
    const params = {
      TableName: this.dynamoDbTable,
      Item: {
        ...data,
        id: randomUUID(),
        createdAt: new Date().toISOString(),
      },
    };

    return params;
  }

  async insertData(data) {
    return this.dynamoDb.put(data).promise();
  }

  handlerSuccess(data) {
    return { statusCode: 200, body: JSON.stringify(data) };
  }

  handlerError(data) {
    return {
      statusCode: data.statusCode || 501,
      body: "Couldn't create item!!",
      headers: { "Content-Type": "text/plain" },
    };
  }

  async main(event) {
    try {
      const data = JSON.parse(event.body);
      const dbParams = this.prepareData(data);
      await this.insertData(dbParams);

      return this.handlerSuccess(dbParams.Item);
    } catch (error) {
      console.error(">>> Deu ruim", error.stack);
      return this.handlerError({ statusCode: 500 });
    }
  }
}

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const handler = new Handler({ dynamoDb });

module.exports.main = handler.main.bind(handler);
