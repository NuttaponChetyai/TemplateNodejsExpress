const httpStatus = require('http-status');
const expressValidation = require('express-validation');
const APIError = require('../utils/APIError');
const { env, headerSession, applicationname } = require('../../configs/vars');
const { mappingResultCode } = require('../utils/mapping-resultcode');
const { handlerResponse } = require('../handleLogger/handlerResponse');
const { STAT } = require('../utils/stat');
const uuid = require('uuid');
const perf = require('execution-time')();
const { logger, logstat } = require('../../configs/logger');
const { checkCommandName } = require('../utils/listAPI');
//deconstructor javascript

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
const handler = (err, req, res, next) => {
  let transactionid = uuid.v4();
  if (req.headers[headerSession] === null || req.headers[headerSession] === undefined) {
    req.headers[headerSession] = transactionid;
    perf.start(req.headers[headerSession]);
    logger.info('Request', { request: req, sessionId: req.headers[headerSession] });
  }

  const response = {
    responseData: {
      resultCode: mappingResultCode(err.status, err.errors),
      resultDescription: err.message || httpStatus[err.status],
      resultData: err.errors,
      developerMessage: err.stack
    },
    httpStatus: err.status
    // stack: err.stack,
  };

  if (env !== 'develop') {
    delete response.stack;
  }


  let command = checkCommandName(req.path, req.method);
  if (err.status === 404) {
    handlerResponse(req, res, response, 'Command not found.', true);
  } else if (err.status === 400) {
    logstat.inc({ nodename: `${applicationname}`, commandname: command, method: req.method, statname: STAT.BAD_REQUEST });
    handlerResponse(req, res, response, command);
  } else {
    handlerResponse(req, res, response, 'Internal server error.', true);
  }



  // if(err.status === 404 || err.status === 400){
  //   if (listApi.includes(command)) {
  //     handlerResponse(req, res, response, command);
  //   } else {
  //     handlerResponse(req, res, response, 'Command not found', true);
  //   }
  // }


  // res.status(err.status);
  // res.json(response);
};
exports.handler = handler;

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
exports.converter = (err, req, res, next) => {
  let convertedError = err;
  if (err instanceof expressValidation.ValidationError) {
    convertedError = new APIError({
      message: 'Validation Error',
      errors: err.errors,
      status: err.status,
      stack: err.stack,
    });
  }
  else if (err instanceof SyntaxError) {
    convertedError = new APIError({
      message: 'Json Formatter Error',
      errors: 'Json format request invalid',
      status: err.statusCode,
      stack: err.error,
    });
  }
  else if (!(err instanceof APIError)) {
    convertedError = new APIError({
      message: err.message,
      status: err.status,
      stack: err.stack,
    });
  }
  return handler(convertedError, req, res);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
exports.notFound = (req, res, next) => {
  const err = new APIError({
    message: 'Not found',
    status: httpStatus.NOT_FOUND,
  });
  return handler(err, req, res);
};
