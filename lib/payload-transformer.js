const config = require('config');

const responseTransform = (payload) => {
  return !payload ? {} : {
    firstName: payload.user_metadata && !isUndefined(payload.user_metadata.first_name) ?
      payload.user_metadata.first_name : payload.given_name,
    lastName: payload.user_metadata && !isUndefined(payload.user_metadata.last_name) ?
      payload.user_metadata.last_name : payload.family_name,
    homeAddress: payload.user_metadata && !isUndefined(payload.user_metadata.home_address) ?
      payload.user_metadata.home_address : {},
    officeAddress: payload.user_metadata && !isUndefined(payload.user_metadata.office_address) ?
          payload.user_metadata.office_address : {},
    email: payload.email,
  }
}

const isUndefined = (value) => {
  return value === undefined
}


const userTransform = (payload) => {
    return !payload ? {} : {
        user_id: '',
        connection: config.get('connections.usernamePasswords'),
        email: payload.email,
        password: payload.password,
        given_name: payload.firstName,
        family_name: payload.lastName,
        email_verified: false,
        verify_email: true
    }
};

const requestTransform = (payload) => {
    return !payload ? {} : {
        user_metadata: {
            first_name: payload.firstName,
            last_name: payload.lastName,
            date_of_birth: payload.dateOfBirth,
            home_address: (payload.homeAddress)?{
                street1: payload.homeAddress.street1,
                street2: payload.homeAddress.street2,
                city: payload.homeAddress.city,
                country: payload.homeAddress.country,
                postcode: payload.homeAddress.postcode
            }: {},
            office_address: (payload.officeAddress)?{
                street1: payload.officeAddress.street1,
                street2: payload.officeAddress.street2,
                city: payload.officeAddress.city,
                country: payload.officeAddress.country,
                postcode: payload.officeAddress.postcode
            }:{}
        }
    }
}

module.exports = {userTransform, requestTransform, responseTransform}