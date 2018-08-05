const config = require('config');
const fetch = require('node-fetch');

const getToken = async () => {
    /* Getting access_token for Machine-to-Machine auth0 calls
     * The token can be stored in session (or db) to avoid additional calls to auth0 due to rate limit set by them.
     * Below is the sample code to retrieve token from auth0. For this sample-code, a generated access_token is provided
     * whose validity expires after 4 days.
     */

    /*
    console.log('Calling auth0 to get new accessToken');
    const authUrl = `${config.get('baseUrl')}${config.get('auth0Paths.authorize')}`;
    const payload = {
        client_id: process.env.auth0_clientId,
        client_secret: process.env.auth0_clientSecret,
        audience: config.get('audience')[0],
        grant_type: config.get('grantTypes')[0]
    };

    const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    const responseBody = await response.json();
    if (response.status === 200) {
        return responseBody.access_token;
    }
    console.log('Unexpected result, no access token returned by auth0');*/

    return config.get('MACHINE_ACCESS_TOKEN');
};

module.exports = { getToken };
