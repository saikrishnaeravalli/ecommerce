const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('mongoose').model('User');

// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "TOP_SECRET"
};

// app.js will pass the global passport object here, and this function will configure it
module.exports = (passport) => {

    // The JWT payload is passed into the verify callback
    passport.use(new JwtStrategy(options, function (jwt_payload, done) {
        // Since we are here, the JWT is valid!

        // We will assign the `sub` property on the JWT to the database ID of user
        User.findOne({ _id: jwt_payload.userId }, function (err, user) {

            // This flow look familiar?  It is the same as when we implemented
            // the `passport-local` strategy
            if (err) {
                return done(err, false);
            }
            if (user) {

                // Since we are here, the JWT is valid and our user is valid, so we are authorized!
                return done(null, user);
            } else {
                return done(null, false);
            }

        });

    }));
}