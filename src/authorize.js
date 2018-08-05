const jwt = require('jsonwebtoken')
const config = require('config')
const jwksClient = require('jwks-rsa');

const client = jwksClient({
    strictSsl: true, // Default value
    jwksUri: `${config.get('baseUrl')}${config.get('auth0Paths.jwks')}`
});

// Help function to generate an IAM policy
const generatePolicy = (principalId, effect, resource) => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: (effect && resource) ? effect : 'Deny',
          Resource: resource,
        }
      ],
    }
  }
}

//Use callbacks instead of async, await cause the later doesn't work on local
let handler = (event, context, callback) => {
    const {headers, pathParameters} = event
    let jwtToken = headers && headers.Authorization;
    if (!jwtToken || !pathParameters) {
        console.log('No authorizationToken present in the request.')
        return callback(null, generatePolicy('customer', 'Deny', event.methodArn))
    }

    console.log('Authorization Token received')
    let kid;
    try {
        jwtToken = jwtToken.split(' ')[1];
        const decodedJwt = jwt.decode(jwtToken, {complete: true});
        kid = decodedJwt.header.kid;
    } catch (error) {
        return callback(null, generatePolicy('customer', 'Deny', event.methodArn))
    }

    if(kid) {
        client.getSigningKey(kid, (err, key) => {
            if(err){
                return callback(null, generatePolicy('customer', 'Deny', event.methodArn))
            }

            const signingKey = key.publicKey || key.rsaPublicKey;
            const options = {
                issuer: `${config.get('baseUrl')}/`,
                audience: config.get('audience')[1]
            };
            // Now use this key to verify token
            try {
                const decoded = jwt.verify(jwtToken, signingKey, options);
                if (decoded) {
                    return callback(null, generatePolicy('customer', 'Allow', event.methodArn))
                } else {
                    return callback(null, generatePolicy('customer', 'Deny', event.methodArn))
                }
            } catch (error) {
                return callback(null, generatePolicy('customer', 'Deny', event.methodArn))
            }
        });
    }else{
        callback(null, generatePolicy('customer', 'Deny', event.methodArn))
    }
}
module.exports = handler