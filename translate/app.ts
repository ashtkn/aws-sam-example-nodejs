import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { TranslateClient, TranslateTextCommand } from '@aws-sdk/client-translate';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'missing body',
            }),
        };
    }

    const { text } = JSON.parse(event.body);
    if (!text || typeof text !== 'string') {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'missing text',
            }),
        };
    }

    const client = new TranslateClient({ region: process.env.AWS_REGION });
    const command = new TranslateTextCommand({
        Text: text,
        SourceLanguageCode: 'en',
        TargetLanguageCode: 'fr',
    });

    try {
        const data = await client.send(command);
        return {
            statusCode: 200,
            body: JSON.stringify({
                translated_text: data.TranslatedText,
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: err instanceof Error ? err.message : 'some error happened',
            }),
        };
    }
};
