var express = require('express');
var authorRouter = express.Router();
var mongodb = require('mongodb').MongoClient; // Only pull piece 'Mongo Client'
var objectId = require('mongodb').ObjectID; // Deals with mongodb object ids

var router = function(nav) {

    authorRouter.route('/')
        .get(function(req, res) {
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
        });

    authorRouter.route('/:id')
        .get(function(req, res) {
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
        });

    return authorRouter;
};

module.exports = router;
