const assert = require('assert');
const sinon = require('sinon');

const fetchWithTokenApi = require('../lib/fetch-with-authorization-api');
const updateCustomer = require('../src/update-customer');

let event = {
    pathParameters: {
        customerId: 'auth0|ABC'
    },
    body: JSON.stringify({
        firstName: 'ABC',
        lastName: 'XYZ',
        dateOfBirth: '21Jan2017',
        homeAddress: {
            street1: 'street1',
            street2: 'street2',
            city: 'city',
            country: 'country',
            postcode: '2145'
        }
    })
};

const sampleOutput = {
    user_metadata: {
        first_name: 'ABC',
        last_name: 'XYZ',
        date_of_birth: '21Jan2017',
        home_address: {
            street1: 'street1',
            street2: 'street2',
            city: 'city',
            country: 'country',
            postcode: '2145'
        },
        office_address: {}
    }
};

describe('updateCustomer', () => {
    beforeEach(() => {
        sinon.stub(fetchWithTokenApi, 'fetchWithToken');
    });

    afterEach(() => {
        fetchWithTokenApi.fetchWithToken.restore();
    });


    it('should save user details when valid user-id and access_token as input', async () => {
        fetchWithTokenApi.fetchWithToken.returns(Promise.resolve({
            status: 200,
            json: () => Promise.resolve({}),
        }));
        const response = await updateCustomer(event);
        assert.equal(response.statusCode, 200);
        assert.deepEqual(fetchWithTokenApi.fetchWithToken.callCount, 1);
        const [url, method, body] = fetchWithTokenApi.fetchWithToken.getCall(0).args;
        assert.equal(url, 'https://test.au.auth0.com/api/v2/users/auth0|ABC');
        assert.equal(method, 'PATCH');
        assert.deepEqual(body, sampleOutput);
    });

    it('return 500 when valid user-id as input but token is expired and cannot generate new token', async () => {
        fetchWithTokenApi.fetchWithToken.returns(Promise.resolve({
            status: 401,
            json: () => Promise.resolve({}),
        }));
        const response = await updateCustomer(event);
        assert.equal(response.statusCode, 500);
        assert.deepEqual(JSON.parse(response.body), {
            error: 'access',
            message: 'Error getting the access token to call auth0 apis'
        });
        assert.deepEqual(fetchWithTokenApi.fetchWithToken.callCount, 1);
        const [url, method, body] = fetchWithTokenApi.fetchWithToken.getCall(0).args;
        assert.equal(url, 'https://test.au.auth0.com/api/v2/users/auth0|ABC');
        assert.equal(method, 'PATCH');
        assert.deepEqual(body, sampleOutput);

    });

    it('should responds with the auth0 error message in case of error', async () => {
        fetchWithTokenApi.fetchWithToken.returns(Promise.resolve({
            status: 123,
            json: () => Promise.resolve({message: 'Exception:message'}),
        }));
        const response = await updateCustomer(event);
        assert.equal(response.statusCode, 123);
        assert.deepEqual(JSON.parse(response.body), {
            error: 'customer',
            message: 'message'
        });
        assert.deepEqual(fetchWithTokenApi.fetchWithToken.callCount, 1);
        const [url, method, body] = fetchWithTokenApi.fetchWithToken.getCall(0).args;
        assert.equal(url, 'https://test.au.auth0.com/api/v2/users/auth0|ABC');
        assert.equal(method, 'PATCH');
        assert.deepEqual(body, sampleOutput);
    });
});
