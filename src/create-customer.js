const {getSuccessResponse, getErrorResponse, getFormattedMessage} = require('../lib/responses.js');
//const retrieveUserByEmail = require('./retrieveUserByEmail.js');
const config = require('config');
const transformer = require('../lib/payload-transformer.js');
const fetchWithTokenApi = require('../lib/fetch-with-authorization-api.js');
const {HTTP_STATUS_CODE_OK, HTTP_STATUS_CODE_BAD_REQUEST,HTTP_STATUS_CODE_INTERNAL_SERVER,HTTP_STATUS_CODE_CREATED,
    HTTP_STATUS_CODE_UNAUTHORIZED,HTTP_STATUS_CODE_FORBIDDEN} = require('../lib/constants.json');

let handler = async (event) =>{
    console.log('Auth0 Create Customer being called..');
    const {body} = event;
    if(body) {
        let payload = formatBody(body);
        let url = `${config.get('baseUrl')}${config.get('auth0Paths.customers')}`;
        const response = await fetchWithTokenApi.fetchWithToken(url, 'POST', payload);
        console.log('Response-------------',response.status);
        let responseBody = await response.json();
        switch (response.status) {
            case HTTP_STATUS_CODE_OK:
            case HTTP_STATUS_CODE_CREATED:
                return getSuccessResponse({userId: responseBody.user_id});
            case HTTP_STATUS_CODE_UNAUTHORIZED:
            case HTTP_STATUS_CODE_FORBIDDEN:
                return getErrorResponse(HTTP_STATUS_CODE_INTERNAL_SERVER, 'access', 'Error getting the access token to call auth0 apis');
            default:
                return getErrorResponse(response.status, 'customer', getFormattedMessage(responseBody));
        }
    }else {
        console.log('Error Response: Invalid customer request');
        return getErrorResponse(HTTP_STATUS_CODE_BAD_REQUEST, 'customer', 'Invalid customer request');
    }
};

const formatBody = (body) => {
    let customer = JSON.parse(body);
    return {
        ...(transformer.userTransform(customer)),
        ...(transformer.requestTransform(customer))
    }
};

module.exports = handler;