import AWS from "aws-sdk";
// import middy from "@middy/core";
// import httpJsonBodyParser from "@middy/http-json-body-parser";
// import httpEventNormalizer from "@middy/http-event-normalizer";
// import httpErrorHandler from "@middy/http-error-handler";

// instaed above those we can call the common middleware we have created
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {
  let auction;
  const { id } = event.pathParameters;

  try {
    const result = await dynamodb
      .get({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: {id: id} // Or Key: {id} both are same.
      })
      .promise();

    auction = result.Item;

    if(!auction) {
        throw new createError.NotFound(`Auction with ID: ${id} not found`)
    }
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

// export const handler = middy(getAuction)
//   .use(httpJsonBodyParser()) // Parse the stringify event body
//   .use(httpEventNormalizer()) // Saves from the error of API gateway object's non defied path/query parameter
//   .use(httpErrorHandler());

// Instaed of this we can use common middleware we have created
export const handler = commonMiddleware(getAuction)
