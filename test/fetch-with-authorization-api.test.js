const nock = require('nock');
const assert = require('assert');
const sinon = require('sinon');
const tokenManager = require('../lib/token-manager');
const {fetchWithToken} = require('../lib/fetch-with-authorization-api');

describe('fetch-with-authorization-api', () => {
    beforeEach(() => {
        sinon.stub(tokenManager, 'getToken');
    });

    afterEach(() => {
        tokenManager.getToken.restore();
        nock.cleanAll();
    });

    it('should fetch with token when available', async () => {
        tokenManager.getToken.returns(Promise.resolve('ACDF956'));
        nock('https://test.com/api/v2/users/auth0|ABC', {
            reqheaders: {
                authorization: 'Bearer ACDF956'
            }
        }).get('').reply(200, {});
        const response = await fetchWithToken(
            'https://test.com/api/v2/users/auth0|ABC',
            'GET'
        );
        assert.equal(response.status, 200);
    });

    it('should return 401 when cannot fetch', async () => {
        nock('https://test.com/api/v2/users/auth0|ABC', {
            reqheaders: {
                authorization: 'Bearer ACDF956'
            }
        }).get('').reply(401, {});
        const response = await fetchWithToken(
            'https://test.com/api/v2/users/auth0|ABC',
            'GET'
        );
        assert.equal(response.status, 401);
    });
});
