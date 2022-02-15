const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const passport = require('passport');
const strategies = require('./passport');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('../api/routes/v1');
const { logs, headerSession } = require('./vars');
const uuid = require('uuid');
const error = require('../api/middlewares/error');
const Prometheus = require('prom-client');
const collectDefaultMetrics = Prometheus.collectDefaultMetrics;
const utility = require('../api/utils/utility');
const perf = require('execution-time')();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../apidocs/swagger.json');
const { logger, transactionTotal, concurrentTotal } = require('../configs/logger');
collectDefaultMetrics({ timeout: 5000 });

/**
* Express instance
* @public
*/
const app = express();

// request logging. dev: console | production: file
app.use(morgan(logs));

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// enable authentication
app.use(passport.initialize());
passport.use('jwt', strategies.jwt);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', function (req, res, next) {
    concurrentTotal.inc();
    let transactionid = uuid.v4();
    if (req.headers[headerSession] === null || req.headers[headerSession] === undefined) {
        req.headers[headerSession] = transactionid;
    }
    let uri = req.path;
    req.headers['x-req-timestamp'] = utility.getTimestamp();
    res.set(`${headerSession}`, req.headers[headerSession]);
    logger.info('Request', { request: req, sessionId: req.headers[headerSession] });
    res.setHeader("Content-Security-Policy", "script-src 'self'");
    perf.start(req.headers[headerSession]);
    next();
  
    res.on('finish', () => {
        concurrentTotal.dec();
        transactionTotal.inc({ uri: uri, method: req.method, statuscode: res.statusCode });
    });
});


app.get('/metrics', (req, res) => {
    res.set('Content-Type', Prometheus.register.contentType);
    res.end(Prometheus.register.metrics());
});

// mount api v1 routes
app.use('/api/v1', routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
