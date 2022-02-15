const winston = require('winston')
require('winston-daily-rotate-file');
const { label, splat, combine, timestamp, printf } = winston.format;
const os = require('os');
const path = require('path');
const Prometheus = require('prom-client');
const env = require('./vars');
const utility = require('../api/utils/utility');

exports.concurrentTotal = new Prometheus.Gauge({
  name: `${env.applicationname}_concurrent_total`,
  help: 'concurrent total'
});

exports.transactionTotal = new Prometheus.Counter({
  name: `${env.applicationname}_transaction_total`,
  help: 'transaction total',
  labelNames:['uri','method','statuscode']
});

exports.logstat = new Prometheus.Counter({
  name: `${env.applicationname}_stat_total`,
  help: 'stat total',
  labelNames:['nodename','commandname','method','statname']
});

var transportedr = new (winston.transports.DailyRotateFile)({
  // filename: path.join(__dirname, '../logs/service/%DATE%-service.log'),
  filename: path.join(__dirname, '../logs/edr/%DATE%-service.log'),
  frequency: '10m',
  datePattern: 'YYYYMMDD-HHmm'
});

var transportcdr = new (winston.transports.DailyRotateFile)({
  // filename: path.join(__dirname, '../logs/service/%DATE%-service.log'),
    filename: path.join(__dirname, '../logs/cdr/%DATE%-service.log'),
  frequency: '10m',
  datePattern: 'YYYYMMDD-HHmm'
});

const edrFormat = printf(info => {
  let obj = {
    logLevel: info.level,
    logType: 'Detail',
    systemTimestamp: utility.getTimestamp(),
    namespace: env.servicename,
    containerId: os.hostname(),
    sessionId: info.sessionId,
    applicationName: env.applicationname,
    custom1: {
      request: info.request ? {
        method: info.request.method,
        uri: info.request.headers.host + info.request.url,
        headers: info.request.headers,
        body: info.request.body,
        params: info.request.params || undefined
      } : undefined,
      response: info.response ? {
        headers: info.response.headers,
        httpStatus: info.response.httpStatus,
        data: info.response.data
      } : undefined,
      stacktrace: info.exception ? info.exception : undefined,

    },    
 
  };
  var result = JSON.stringify(obj);
  return result;
});

const cdrFormat = printf(info => {
  let obj = {
    logType: 'Summary',
    systemTimestamp: utility.getTimestamp(),
    containerId: os.hostname(),
    namespace: env.servicename,
    applicationName: env.applicationname,
    reqTimestamp: info.reqTimestamp,
    sessionId: info.sessionId,
    cmdName:info.cmdName,
    resultCode: info.resultCode,
    resultDesc: info.resultDesc,
    custom: (info.custom !== undefined ) ? info.custom :  undefined,
    resTimestamp: info.resTimestamp,
    usageTime: info.usageTime    
  };
  var result = JSON.stringify(obj);
  return result;
});

exports.logger = winston.createLogger({
  format: combine(
    label({ label: 'Authenservice' }),
    timestamp(),
    splat(),
    edrFormat
  ),
  transports: [
    transportedr,
    new winston.transports.Console(),
  ]
});

exports.loggerCDR = winston.createLogger({
  format: combine(
    label({ label: 'Authenservice' }),
    timestamp(),
    splat(),
    cdrFormat
  ),
  transports: [
    transportcdr,
    new winston.transports.Console(),
  ]
});
