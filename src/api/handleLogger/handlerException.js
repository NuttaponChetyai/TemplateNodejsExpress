const httpStatus = require('http-status');
const { logger, logstat } = require('../../configs/logger');
const { RESULT } = require('../utils/Result');
const { headerSession, applicationname } = require('../../configs/vars');
const { handlerCDRError, responseErrorLogger } = require('./handlerResponse');
const { STAT } = require('../utils/stat');

exports.handlerException = (exception, commandname, req, res) => {
    let sessionId = req.headers[`${headerSession}`];
    let resp;
    if (exception.stack && exception.stack.name == "MongoError") {
        logstat.inc({ nodename: `${applicationname}`, commandname: commandname, method: req.method, statname: STAT.DATABASE_ERROR });
        resp = responseErrorLogger(httpStatus.INTERNAL_SERVER_ERROR, RESULT.DATABASE_ERROR.resultCode, RESULT.DATABASE_ERROR.resultDescription, res.getHeaders());
        logger.error(` Response ${commandname}`, { response: resp, sessionId: sessionId, exception: exception.stack });
    } else if (exception.stack && exception.stack.name == "ValidationError") {
        logstat.inc({ nodename: `${applicationname}`, commandname: commandname, method: req.method, statname: STAT.BAD_REQUEST });
        resp = responseErrorLogger(httpStatus.BAD_REQUEST, RESULT.BAD_REQUEST.resultCode, " Validation Error", res.getHeaders());
        logger.error(` Response ${commandname}`, { response: resp, sessionId: sessionId, exception: exception.stack });
    } else {
        logstat.inc({ nodename: `${applicationname}`, commandname: commandname, method: req.method, statname: STAT.ERROR });
        resp = responseErrorLogger(httpStatus.INTERNAL_SERVER_ERROR, RESULT.INTERNAL_SERVER_ERROR.resultCode, RESULT.INTERNAL_SERVER_ERROR.resultDescription, res.getHeaders());
        logger.error(` Response ${commandname}`, { response: resp, sessionId: sessionId, exception: exception.stack });
    }
    handlerCDRError(req, resp, commandname);
    res.status(resp.httpStatus).json(resp.data);
};