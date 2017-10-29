// Controller for book routes
// Structure: Revealing Model Pattern
var mongodb = require('mongodb').MongoClient; // Only pull piece 'Mongo Client'
var objectId = require('mongodb').ObjectID; // Deals with mongodb object ids

var authorController = function(authorService, nav) {

    // In order to not allow user to access authors when he is not logged in, add
    // middleware to entire authorRouter
    var middleware = function(req, res, next) {
        if (!req.user) { // if not logged in, redirect to home
            res.redirect('/'); // redirect response, you cannot redirect request
        }
        next(); // otherwise continue
    };

    var getIndex = function(req, res) {
        var url = 'mongodb://localhost:27017/libraryApp';
        // Connect to mongodb
        mongodb.connect(url, function(err, db) {
            // Get mongodb collection of authors and find all authors
            var collection = db.collection('authors');
            collection.find({}).toArray(function(err, results) {
                res.render('authorListView', {
                    title: 'Authors',
                    nav: nav,
                    authors: results
                });
            });
        });
    };

    var getById = function(req, res) {
        var id = new objectId(req.params.id); // create new mongodb object id instance
        var url = 'mongodb://localhost:27017/libraryApp';
        // Connect to mongodb
        mongodb.connect(url, function(err, db) {
            // Get mongodb collection of authors and find author with requested id
            var collection = db.collection('authors');
            collection.findOne({_id: id},
                function(err, results) {
                    res.render('authorView', {
                        title: 'Authors',
                        nav: nav,
                        author: results
                    });
                });
        });
    };

    // Return a json with all functions
    return {
        getIndex: getIndex,
        getById: getById,
        middleware: middleware
    };
};

module.exports = authorController;
