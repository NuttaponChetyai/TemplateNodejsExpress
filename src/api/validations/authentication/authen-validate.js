const Joi = require('joi');

module.exports = {

  login: {
    body: {
      username: Joi.string().required().error(errors => {
        return {
          message: "parameter username is required."
        };
      }),
      password: Joi.string().required().error(errors => {
        return {
          message: "parameter password is required."
        };
      })
    }
  }
};
