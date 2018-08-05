const assert = require('assert');
const sinon = require('sinon');

const fetchWithTokenApi = require('../lib/fetch-with-authorization-api');
const retrieveCustomer = require('../src/retrieve-customer');

let event = {
    pathParameters: {
        customerId: 'auth0|ABC'
    }
};

const sampleOutput = {
    user_metadata: {
        first_name: 'ABC',
        last_name: 'XYZ',
        home_address: {
            street1: 'street1',
            street2: 'street2',
            city: 'city',
            country: 'country',
            postcode: '2145'
        }
    }
};

describe('retrieveCustomer', () => {
    beforeEach(() => {
        sinon.stub(fetchWithTokenApi, 'fetchWithToken');
    });

    afterEach(() => {
        fetchWithTokenApi.fetchWithToken.restore();
    });

    it('should retrieve customer details when valid user-id and access_token as input', async () => {
        fetchWithTokenApi.fetchWithToken.returns(Promise.resolve({
            status: 200,
            json: () => Promise.resolve(sampleOutput),
        }));
        const response = await retrieveCustomer(event);
        assert.equal(response.statusCode, 200);
        const respBody = JSON.parse(response.body);
        assert.equal(respBody.firstName, sampleOutput.user_metadata.first_name);

        assert.deepEqual(fetchWithTokenApi.fetchWithToken.callCount, 1);
        const [url, method, body] = fetchWithTokenApi.fetchWithToken.getCall(0).args;
        assert.equal(url, 'https://test.au.auth0.com/api/v2/users/auth0|ABC');
        assert.equal(method, 'GET');
    });

    it('should respond with error when unauthorized', async () => {
        fetchWithTokenApi.fetchWithToken.returns(Promise.resolve({
            status: 401,
            json: () => Promise.resolve({}),
        }));
        const response = await retrieveCustomer(event);
        assert.equal(response.statusCode, 500);
        assert.deepEqual(JSON.parse(response.body), {
            error: 'access',
            message: 'Error getting the access token to call auth0 apis'
        });
        assert.deepEqual(fetchWithTokenApi.fetchWithToken.callCount, 1);
        const [url, method] = fetchWithTokenApi.fetchWithToken.getCall(0).args;
        assert.equal(url, 'https://test.au.auth0.com/api/v2/users/auth0|ABC');
        assert.equal(method, 'GET');
    });

    it('should responds with the auth0 error message in case of error', async () => {
        fetchWithTokenApi.fetchWithToken.returns(Promise.resolve({
            status: 123,
            json: () => Promise.resolve({message: 'Exception:message'}),
        }));
        const response = await retrieveCustomer(event);
        assert.equal(response.statusCode, 123);
        assert.deepEqual(JSON.parse(response.body), {
            error: 'customer',
            message: 'message'
        });
        assert.deepEqual(fetchWithTokenApi.fetchWithToken.callCount, 1);
        const [url, method] = fetchWithTokenApi.fetchWithToken.getCall(0).args;
        assert.equal(url, 'https://test.au.auth0.com/api/v2/users/auth0|ABC');
        assert.equal(method, 'GET');
    });
});