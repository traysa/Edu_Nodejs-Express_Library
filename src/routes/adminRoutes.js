var express = require('express');
var adminRouter = express.Router();
var mongodb = require('mongodb').MongoClient; // Only pull piece 'Mongo Client'
var fs = require('fs');

//------------------------------------------------------------------------------
// Get Book Data
//------------------------------------------------------------------------------
// Synchronous read from JSON file
var books = JSON.parse(fs.readFileSync('data/books.json', 'utf8'));
// Asynchronous read from JSON file
// var books;
// fs.readFileSync('data/books.json', 'utf8', function(err, data) {
//     if (err) {
//         throw err;
//     }
//     books = JSON.parse(data);
// });
// Static JSON
// var books = [
//     {
//         title: 'aaa',
//         genre: 'aaa',
//         author: 'aaa',
//         read: false
//     },
//     {
//         title: 'bbb',
//         genre: 'bbb',
//         author: 'bbb',
//         read: false
//     },
//     {
//         title: 'ccc',
//         genre: 'ccc',
//         author: 'ccc',
//         read: false
//     }
// ];

//------------------------------------------------------------------------------
// Get Author Data
//------------------------------------------------------------------------------
// Synchronous read from JSON file
var authors = JSON.parse(fs.readFileSync('data/authors.json', 'utf8'));
// Asynchronous read from JSON file
// var authors;
// fs.readFileSync('data/authors.json', 'utf8', function(err, data) {
//     if (err) {
//         throw err;
//     }
//     authors = JSON.parse(data);
// });
// Static JSON
// var authors = [
//     {
//         firstname: 'Ofelia',
//         lastname: 'Dromolus',
//         birthday: '17.06.1972'
//     },
//     {
//         firstname: 'Mads',
//         lastname: 'Madsen',
//         birthday: '25.09.1956'
//     }
// ];

//------------------------------------------------------------------------------
// Create routes
//------------------------------------------------------------------------------
var router = function(nav) {

    // Create route to add books
    adminRouter.route('/addBooks')
    .get(function (req, res) {
        var url = 'mongodb://localhost:27017/libraryApp';
        // Connect to mongodb
        mongodb.connect(url, function(err, db) {
            // Get mongodb collection of books and insert books
            var collection = db.collection('books');
            collection.insertMany(books, function(err, results) { //insertOne is used if just a single json object should be inserted
                res.send(results);
                db.close(); // database connection must be closed in the callback function
            });
            //db.close(); // this will not work since it will immediately close the db after calling insertMany
        });
    });

    // Create route to add books
    adminRouter.route('/addAuthors')
    .get(function (req, res) {
        var url = 'mongodb://localhost:27017/libraryApp';
        // Connect to mongodb
        mongodb.connect(url, function(err, db) {
            // Get mongodb collection of authors and insert authors
            var collection = db.collection('authors');
            collection.insertMany(authors, function(err, results) { //insertOne is used if just a single json object should be inserted
                res.send(results);
                db.close(); // database connection must be closed in the callback function
            });
            //db.close(); // this will not work since it will immediately close the db after calling insertMany
        });
    });

    return adminRouter;
};

module.exports = router;
