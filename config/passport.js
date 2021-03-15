const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');

module.exports = function(passport){
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, (jwt_payload, next) => {
    User.getUserById(jwt_payload._id, (err, user) => {
      if(err){
        return next(err, false);
      }
      if(user){
        return next(null, user);
      } else {
        return next(null, false);
      }
    });
  }));
}
