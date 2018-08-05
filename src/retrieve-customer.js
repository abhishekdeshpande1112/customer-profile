const config = require('config');

const {getSuccessResponse, getErrorResponse, getFormattedMessage} = require('../lib/responses.js');
const fetchWithTokenApi = require('../lib/fetch-with-authorization-api.js');
const transformer = require('../lib/payload-transformer.js');
const {HTTP_STATUS_CODE_OK, HTTP_STATUS_CODE_UNAUTHORIZED, HTTP_STATUS_CODE_INTERNAL_SERVER,
    HTTP_STATUS_CODE_FORBIDDEN, HTTP_STATUS_CODE_BAD_REQUEST} = require('../lib/constants.json');

let handler = async (event) =>{
    console.log('Auth0 Customer Details being called..');
    const {pathParameters} = event;

    if(pathParameters && pathParameters.customerId) {
        console.log('Step-1----------Get accessToken');
        const apiUrl = `${config.get('baseUrl')}${config.get('auth0Paths.customers')}/${pathParameters.customerId}`;
        let response = await fetchWithTokenApi.fetchWithToken(apiUrl, 'GET');
        console.log('Response-------------',response.status);

        let responseBody = await response.json();
        switch (response.status) {
            case HTTP_STATUS_CODE_OK:
                let transformedResponse = transformer.responseTransform(responseBody);
                return getSuccessResponse(transformedResponse);
            case HTTP_STATUS_CODE_UNAUTHORIZED:
            case HTTP_STATUS_CODE_FORBIDDEN:
                return getErrorResponse(HTTP_STATUS_CODE_INTERNAL_SERVER, 'access', 'Error getting the access token to call auth0 apis');
            default:
                return getErrorResponse(response.status, 'customer', getFormattedMessage(responseBody));
        }
    }else {
        console.log('Error Response: Invalid customerDetails request');
        return getErrorResponse(HTTP_STATUS_CODE_BAD_REQUEST, 'customerId', 'Invalid customerDetails request');
    }
};

module.exports = handler;