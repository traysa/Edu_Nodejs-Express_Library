// Keep all passport code in here

// Authentication middleware
var passport = require('passport');

// Instead of defining a function in a variable and then setting the variable to
// module.exports afterwards, you can also directly set the function definition

module.exports = function(app) {
    app.use(passport.initialize());
    app.use(passport.session()); // passport session sits on top of express-session

    // Set user into the session for later use
    passport.serializeUser(function(user, done) {
        // package user up to store it in the session
        done(null, user); // you can also just store user.id
    });

    // Pull user from of the session
    passport.deserializeUser(function(user, done) { // you could also name it userId if more suitable

        // Pull out whatever was stored in the session
        done(null, user);
    });

    // Call local passport strategy
    require('./strategies/local.strategy')();
};
