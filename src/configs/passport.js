const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { jwtSecret } = require('./vars');

const jwtOptions = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
};

const jwt = async (payload, done) => {
  try {
    // // inquiry user
    // const user = await User.findOne({ _id: payload.sub.informations._id }).populate('roles');
    // // const userinfo = _.omit(user.toObject(), ['password','roles']);
    // // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    // const roles = _.map(user.roles, 'roleName');
    // const information = {
    //   userId: user._id,
    //   username: user.username,
    //   roles: roles
    // };
    let user = null;
    if (user) return done(null, information);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

exports.jwt = new JwtStrategy(jwtOptions, jwt);

