const fetch = require('node-fetch');
const tokenManager = require('./token-manager');

const fetchWithToken = async (url, method, body) => {
    console.log('Fetching access token');
    const token = await tokenManager.getToken();
    const response = await (token ? fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: body ? JSON.stringify(body) : undefined,
    }) : {status: 401, json: () => Promise.resolve({message: 'Exception:No Access token'})});
    console.log('Response from auth0 api call: ', response.status);
    return response;
};

module.exports = {fetchWithToken};
