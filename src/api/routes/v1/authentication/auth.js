const express = require('express');
// const validate = require('express-validation');
const { validate, ValidationError, Joi } = require('express-validation')
const controller = require('../../../controllers/authentication/authen');
const validation = require('../../../validations/authentication/authen-validate');
const router = express.Router();
// const samlService = require('../../../services/saml/saml-auth');

router.route('/login').post(validate(validation.login), controller.login);
module.exports = router;
