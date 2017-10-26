var express = require('express');
var authRouter = express.Router();
var mongodb = require('mongodb').MongoClient; // Only pull piece 'Mongo Client'
var passport = require('passport');

var router = function() {
    authRouter.route('/signUp')
        .post(function(req, res) {
            console.log(req.body); // log to the console
            // Start mongodb connection
            var url = 'mongodb://localhost:27017/libraryApp';
            mongodb.connect(url, function(err, db) {
                var collection = db.collection('users');
                // Create user object
                var user = {
                    username: req.body.userName, // middleware bodyParser, which is set up in the app.js, returns the request input as JSON into req.body
                    password: req.body.password
                };
                // Insert user object into users collection; You might want to do some validations
                collection.insert(user, function(err, results) {
                    req.login(results.ops[0], function() { // results returns a JSON with a key ops, which contains the user entries
                        res.redirect('/auth/profile'); // Passport middleware adds login to the request
                    });
                });
            });
        });

    authRouter.route('/signIn')
        .post(passport.authenticate('local', {
            failureRedirect: '/' // adding one option: redirect to home if authentication fails
        }), function (req, res) { // if it not fails, run this callback function, which redirects to the profile
            res.redirect('/auth/profile');
        }); // Handing over to passport to deal with authentication

    authRouter.route('/profile')
        // Securing individual route with middleware
        .all(function(req, res, next) { // Add middleware to authorize the road to profile; You should not be able to go to profile, if you do not have a valid user
            if (!req.user) { // if not logged in, redirect to home
                res.redirect('/'); // redirect response, you cannot redirect request
            }
            next(); // otherwise continue
        })
        .get(function(req, res) {
            res.json(req.user);
        });
    return authRouter;
};

module.exports = router;
