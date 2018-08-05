const config = require('config');
const {getSuccessResponse, getErrorResponse} = require('../lib/responses.js');
const fetchWithTokenApi = require('../lib/fetch-with-authorization-api.js');
const {HTTP_STATUS_CODE_NO_CONTENT, HTTP_STATUS_CODE_UNAUTHORIZED, HTTP_STATUS_CODE_INTERNAL_SERVER,
        HTTP_STATUS_CODE_FORBIDDEN, HTTP_STATUS_CODE_BAD_REQUEST} = require('../lib/constants.json');

const handler = async (event) => {
    console.log('Auth0 Delete Customer being called..');
    const {pathParameters} = event;

    if (pathParameters && pathParameters.customerId) {
        const baseUrl = config.get('baseUrl');
        const path = config.get('auth0Paths.customers');
        const apiUrl = `${baseUrl}${path}/${pathParameters.customerId}`;

        console.log('Deleting Customer');
        const response = await fetchWithTokenApi.fetchWithToken(apiUrl, 'DELETE');
        console.log('Delete Customer Response:', response.status);

        switch (response.status) {
            case HTTP_STATUS_CODE_NO_CONTENT:
                return getSuccessResponse();
            case HTTP_STATUS_CODE_UNAUTHORIZED:
            case HTTP_STATUS_CODE_FORBIDDEN:
                return getErrorResponse(HTTP_STATUS_CODE_INTERNAL_SERVER, 'access', 'Error getting the access token to call auth0 apis');
            default:
                return getErrorResponse(response.status, 'application', 'Unexpected error has occurred');
        }
    } else {
        console.log('Error Response: Invalid customerDetails request');
        return getErrorResponse(Constants.HTTP_STATUS_CODE_BAD_REQUEST, 'data', 'Invalid customerDetails request');
    }
};

module.exports = handler;