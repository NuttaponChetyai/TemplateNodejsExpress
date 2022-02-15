
// import .env variables
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

// define global variable from env
module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  applicationname: process.env.APPLICATION_NAME,
  headerSession: process.env.HEADER_SESSION_FIELD,
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};
