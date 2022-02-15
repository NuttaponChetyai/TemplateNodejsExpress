const httpStatus = require('http-status');
const userservice = require('../../services/user/user.service');
const { generateResponse } = require('../../utils/Response');
const { RESULT } = require('../../utils/Result');
const authservice = require('../../services/auth/auth.service');
const { handlerException } = require('../../handleLogger/handlerException');
const { handlerResponse } = require('../../handleLogger/handlerResponse');

exports.login = async (req, res) => {
	let response;
	let isError = false;
	try {
		const user = await userservice.verifyUser(req.body);
		if (user) {
			let token = await authservice.generateJWT(user, 'platform');
			logstat.inc({ nodename: `${applicationname}`, commandname: 'login', method: req.method, statname: STAT.SUCCESS });
			response = generateResponse(httpStatus.OK, RESULT.SUCCESS.resultCode, token, 'LOGIN SUCCESS');
		} else {
			isError = true;
			logstat.inc({ nodename: `${applicationname}`, commandname: 'login', method: req.method, statname: STAT.LOGIN_ERROR });
			response = generateResponse(httpStatus.UNAUTHORIZED, RESULT.UNAUTHORIZED.resultCode, undefined, 'INVALID USERNAME OR PASSWORD');
		}
		handlerResponse(req, res, response, 'login', isError);
	}
	catch (err) {
		handlerException(err, 'login', req, res);
	}
};

