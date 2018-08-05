## Overview
This is an API that lets you create, update, retrieve and delete customer details.

## Implementation
The solution delivered here is a Node project implemented using serverless framework.


## Pre-requisites
- Node 8.11.2
- npm 6.0.1

In order to start this project, clone this project from git. Run below commands in the directory containing package.json:
- npm install -g serverless (lets you run serverless command globally)
- npm install

## Additional Notes
- Auth0 is used as identity provider that handles authentication of user as well as authorization for endpoint requests.
- Validity of machine token is set to 4 days. Will not be able to access these endpoints once the token is expired (After 9th August,2018).
- customer-profile-api_0.1_swagger is added for API contract reference.

## Running the program in local mode
After building the application you can run the service by performing the following steps:

1. Start the application
 - sls offline start

2) Call the 'Create Customer'. Customer needs to be created before calling Retrieve/Update/Delete Apis.

3) Generate access_token for above customer using below command. (Note: Replace below username & password of above created customer)

curl -X POST -H "Content-Type: application/json" -d '{
  "client_id": "3UEEwJGeERXeaOAw8WMhIFD2KRJMk5U7",
  "audience": "qantasaustralia",
  "scope": "openid profile",
  "username": "CUSTOMER_EMAIL",
  "password": "CUSTOMER_PASSWORD",
  "grant_type": "password"
}' "https://abdev.au.auth0.com/oauth/token"


4) Retrieve/Update/Delete the customer
 - Add 'Authorization' : 'Bearer access_token' in headers
 - Use the 'user_id' from 'Create Customer' response as {customer_id} in pathParams

##Test Sample
**Request**
URL
http://localhost:5100/customers/auth0|5b666ec62e0e7404788863d6

Headers
Authorization: Bearer access_token
**Response**
{
    "firstName": "Abc",
    "lastName": "Xyz",
    "homeAddress": {
        "street1": "Unit 1",
        "street2": "53 Street Name",
        "city": "Sydney",
        "country": "Australia",
        "postcode": "1111"
    },
    "officeAddress": {},
    "email": "abc.xyz@gmail.com"
}

Some tools used for speeding up the development:
- Serverless framework used for local development as well as aws deployment.
- Swagger used for API contract definition.
- Standard development practice that I normally follow at work is used.

## Improvements TODO
- Validation not implemented
- Authorizer does not validate scopes for access_token.