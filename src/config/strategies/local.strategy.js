// Passport-local strategy: Store user and password in local database

// Authentication middleware
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongodb = require('mongodb').MongoClient;

module.exports = function() {
    passport.use(new LocalStrategy({
        usernameField: 'userName', // define field names as they occur in index.ejs
        passwordField: 'password'
    },
    function(username, password, done) {
        // Connect to users collection in mongodb
        var url = 'mongodb://localhost:27017/libraryApp';
        mongodb.connect(url, function(err, db) {
            var collection = db.collection('users');
            // Get user from collection
            collection.findOne({
                    username: username
                },
                function(err, results) {
                    if (results.password === password) { // compare passwords
                        var user = results;
                        done(null, user);
                    } else {
                        //done('Bad password', null);
                        done (null, false, {message: 'Bad password'}); // null for no errors; false for "no user"; message
                    }
                }
            );
        });
    }));
};
