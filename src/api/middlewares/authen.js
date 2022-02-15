const httpStatus = require('http-status');
const passport = require('passport');
const APIError = require('../utils/APIError');

const handleJWT = (req, res, next) => async (err, user, info) => {
  const error = err || info;
  if (error)
    error.message = (error.message === "No auth token") ? "Unauthorized" : error.message;
  try {
    if (error || !user) {
      let apiError = new APIError({
        message: error ? error.message : 'Unauthorized',
        status: httpStatus.UNAUTHORIZED,
        
      });
      if (apiError.errors === "TokenExpiredError") {
        apiError.errors = undefined;
        apiError.message = "Access token expired";
      }
      throw apiError;
    }
    return next();
  } catch (e) {
    return next(e);
  }
};


exports.authorize = (permission = '') => (req, res, next) => {
  passport.authenticate(
    'jwt', { session: false },
    handleJWT(req, res, next, permission)
  )(req, res, next);
};


