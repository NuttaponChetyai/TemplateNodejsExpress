// // make bluebird default Promise
// Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env } = require('./configs/vars');
const app = require('./configs/express');

// listen to requests
app.listen(port, () => console.log(`application started on port ${port} (${env})`));

/**
* Exports express
* @public
*/
module.exports = app;
