const config = require('config');

const {getSuccessResponse, getErrorResponse, getFormattedMessage} = require('../lib/responses.js');
const transformer = require('../lib/payload-transformer.js');
const fetchWithTokenApi = require('../lib/fetch-with-authorization-api.js');
const {HTTP_STATUS_CODE_OK, HTTP_STATUS_CODE_UNAUTHORIZED, HTTP_STATUS_CODE_INTERNAL_SERVER,
        HTTP_STATUS_CODE_FORBIDDEN, HTTP_STATUS_CODE_BAD_REQUEST} = require('../lib/constants.json');

let handler = async (event) =>{
    console.log('Auth0 Save Customer Details being called..');
    const {pathParameters, body} = event;
    if(pathParameters && pathParameters.customerId && body) {
        const bodyJSON = JSON.parse(body);
        const url = `${config.get('baseUrl')}${config.get('auth0Paths.customers')}/${pathParameters.customerId}`;
        console.log('Step-2----------Save customer details');
        let payload = formatBody(bodyJSON);
        const response = await fetchWithTokenApi.fetchWithToken(url, 'PATCH', payload);
        console.log('Response1-------------',response.status);
        let responseBody = await response.json();

        switch (response.status) {
            case HTTP_STATUS_CODE_OK:
              return getSuccessResponse();
            case HTTP_STATUS_CODE_UNAUTHORIZED:
            case HTTP_STATUS_CODE_FORBIDDEN:
              return getErrorResponse(HTTP_STATUS_CODE_INTERNAL_SERVER, 'access', 'Error getting the access token to call auth0 apis');
            default:
              return getErrorResponse(response.status, 'customer', getFormattedMessage(responseBody));
        }
    }else {
        console.log('Error Response: Invalid customerDetails request');
        return getErrorResponse(HTTP_STATUS_CODE_BAD_REQUEST, 'customer', 'Invalid customerDetails request');
    }
};

const formatBody = (body) => {
    return transformer.requestTransform(body);
};

module.exports = handler;