var express = require('express');
var bookRouter = express.Router();
var mongodb = require('mongodb').MongoClient; // Only pull piece 'Mongo Client'
var objectId = require('mongodb').ObjectID; // Deals with mongodb object ids

var router = function(nav) {

    bookRouter.route('/')
        .get(function(req, res) {
            var url = 'mongodb://localhost:27017/libraryApp';
            // Connect to mongodb
            mongodb.connect(url, function(err, db) {
                // Get mongodb collection of books and find all books
                var collection = db.collection('books');
                collection.find({}).toArray(function(err, results) {
                    res.render('bookListView', {
                        title: 'Books',
                        nav: nav,
                        books: results
                    });
                });
            });
        });

    bookRouter.route('/:id') // with :id anything behind the slash is given as a request parameter called 'id'
        .get(function(req, res) {
            var id = new objectId(req.params.id); // create new mongodb object id instance
            var url = 'mongodb://localhost:27017/libraryApp';
            // Connect to mongodb
            mongodb.connect(url, function(err, db) {
                // Get mongodb collection of books and find book with requested id
                var collection = db.collection('books');
                collection.findOne({_id: id},
                    function(err, results) {
                        res.render('bookView', {
                            title: 'Books',
                            nav: nav,
                            book: results
                        });
                    });
            });
        });

    return bookRouter;
};

module.exports = router;
