// Controller for books
// Structure: Revealing Model Pattern
// returns Book information in JSON format
var mongodb = require('mongodb').MongoClient; // Only pull piece 'Mongo Client'
var objectId = require('mongodb').ObjectID; // Deals with mongodb object ids

var bookController = function(bookService, nav) {

    // In order to not allow user to access books when he is not logged in, add
    // middleware to entire bookRouter
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
    };

    var getById = function(req, res) {
        var id = new objectId(req.params.id); // create new mongodb object id instance
        var url = 'mongodb://localhost:27017/libraryApp';
        // Connect to mongodb
        mongodb.connect(url, function(err, db) {
            // Get mongodb collection of books and find book with requested id
            var collection = db.collection('books');
            collection.findOne({
                    _id: id
                },
                function(err, results) {
                    // If we get a bookId, te book service is called
                    if (results.bookId) {
                        // Call bookservice to get information of the book from goodreads
                        bookService.getBookById(results.bookId,
                            function(err, book) {
                                results.book = book;
                                res.render('bookView', {
                                    title: 'Books',
                                    nav: nav,
                                    book: results
                                });
                            });
                    }
                    else {
                        res.render('bookView', {
                            title: 'Books',
                            nav: nav,
                            book: results
                        });
                    }
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

module.exports = bookController;
