const { headerSession } = require('../../configs/vars');
const utils = require('../utils/utility');
const { logger, loggerCDR } = require('../../configs/logger');
const perf = require('execution-time')();


exports.responseErrorLogger = (httpstatus, resultCode, resultDescription, responseHeader) => {

    let response = {
        httpStatus: httpstatus,
        data: {
            resultCode: resultCode,
            resultDescription: resultDescription
        },
        headers: responseHeader
    };
    return response;
};


exports.handlerResponse = (req, res, respObject, commandName, err) => {
    let sessionId = req.headers[`${headerSession}`];
    let reqTimeStamp = req.header('x-req-timestamp');
    delete req.headers['x-req-timestamp'];

    let tranformResponse = {
        headers: res.getHeaders(),
        httpStatus: respObject.httpStatus,
        data: respObject.responseData
    };
    let customCDR = utils.getRequestResponse(req, tranformResponse);
    if (err) {
        logger.error('Response', { response: tranformResponse, sessionId: sessionId });
    } else {
        logger.info('Response', { response: tranformResponse, sessionId: sessionId });
    }
    let respTimestamp = utils.getTimestamp();
    let usageTime = perf.stop(sessionId);
    loggerCDR.info(`${commandName}`, { reqTimestamp: reqTimeStamp, sessionId: sessionId, cmdName: commandName, resultCode: respObject.responseData.resultCode, resultDesc: respObject.responseData.resultDescription, custom: customCDR, resTimestamp: respTimestamp, usageTime: usageTime.time });
    res.status(respObject.httpStatus).send(respObject.responseData);
};


exports.handlerCDRError = (req, respObject, commandName) => {
    let sessionId = req.headers[`${headerSession}`];
    let reqTimeStamp = req.header('x-req-timestamp');
    delete req.headers['x-req-timestamp'];
    let respTimestamp = utils.getTimestamp();
    let usageTime = perf.stop(sessionId);
    let customCDR = utils.getRequestResponse(req, respObject);
    // let diffTime = utils.gettimeDiff(respTimestamp, reqTimeStamp);
    loggerCDR.info(`${commandName}`, { reqTimestamp: reqTimeStamp, sessionId: sessionId, cmdName: commandName, resultCode: respObject.data.resultCode, resultDesc: respObject.data.resultDescription, custom: customCDR, resTimestamp: respTimestamp, usageTime: usageTime.time });
};

exports.handlerResponseRedirect = (req, res, httpStatus, redirectUrl, commandName, err) => {
    let sessionId = req.headers[`${headerSession}`];
    let reqTimeStamp = req.header('x-req-timestamp');
    delete req.headers['x-req-timestamp'];

    let tranformResponse = {
        headers: res.getHeaders(),
        httpStatus: httpStatus,
        redirectUrl: redirectUrl,
        data: (err) ? {
            redirectUrl: redirectUrl,
            status: 'Fail.'
        } : {
                redirectUrl: redirectUrl,
                status: 'Success.'
            }
    };

    let customCDR = utils.getRequestResponse(req, tranformResponse);
    if (err) {
        logger.error('Response', { response: tranformResponse, sessionId: sessionId });
    } else {
        logger.info('Response', { response: tranformResponse, sessionId: sessionId });
    }
    let respTimestamp = utils.getTimestamp();
    let usageTime = perf.stop(sessionId);
    loggerCDR.info(`${commandName}`, { reqTimestamp: reqTimeStamp, sessionId: sessionId, cmdName: commandName, resultCode: httpStatus, resultDesc: tranformResponse.data, custom: customCDR, resTimestamp: respTimestamp, usageTime: usageTime.time });
};