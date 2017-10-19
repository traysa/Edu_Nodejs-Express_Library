var express = require('express');

var bookRouter = express.Router();

// The package used here is the same instance as in app.js. Therefore the connection
// details, specified in app.js, are also known here.
var sql = require('mssql');

var router = function(nav) {
    var books = [
        {
            title: 'aaa',
            genre: 'aaa',
            author: 'aaa',
            read: false
        },
        {
            title: 'bbb',
            genre: 'bbb',
            author: 'bbb',
            read: false
        },
        {
            title: 'ccc',
            genre: 'ccc',
            author: 'ccc',
            read: false
        }
    ];

    bookRouter.route('/')
        .get(function(req, res) {
            // Get data from the database. The callback function will either
            // give an error or a recordset. The recordset comes back already
            // as a JSON
            var request = new sql.Request();
            request.query('select * from books',
                function(err, recordset) {
                            //console.log(recordset); // Print recordset JSON
                            res.render('bookListView',{
                                title: 'Books',
                                nav: nav,
                                books: recordset
                            });
                        });
        });

    bookRouter.route('/:id') // with :id anything behind the slash is given as a request parameter called 'id'
        // In express 4 the option to add middleware in the route is given by
        // using .all. Instead of preparing a statement for every time a single
        // book should be requested by preparing the statement in the .get part,
        // this can be globalized in the .all part. It can be then re-used also
        // for other routes. Error handling can be also done in the .all function.
        .all(function(req, res, next) { // next lets express know to run the next thing happening (in this case .get)
            // Get data from the database
            // Create prepared statement: A query with parameterized options
            var ps = new sql.PreparedStatement();
            // Passing the id to the prepared statement
            ps.input('id', sql.Int);
            // Prepare statement. Once prepared the callback function is called
            // which will execute the statement. An error parametr is added to
            // the callback function in case something goes wrong
            ps.prepare('select * from books where id = @id',
                function(err) {
                    ps.execute({id:req.parama.id}, // request parameter 'id' obtained by the route. See above.
                        function(err, recordset) {
                            // Error handling
                            if (recordset.length === 0) {
                                res.status(404).send('Not found');
                                // alternative: do a redirect
                            } else {
                                req.book = recordset[0]; // return first recordset since we expecting only one entry
                                next(); // call the next function (in this case .get)
                            }
                        });
                });
        })
        .get(function(req, res) {
            res.render('bookView',{
                title: 'Book',
                nav: nav,
                book: req.book
            });
        });

    return bookRouter;
};

module.exports = router;
